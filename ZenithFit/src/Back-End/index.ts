import express, { type Request, type Response } from "express";
import { connection, prisma } from "./src/db.js"; // Import simplificado
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
connection();

// --- ROTAS ---

// 1. Criar cliente (Atualizado)
app.post("/clientes", async (req: Request, res: Response) => {
  try {
    const dados = req.body;

    const newCliente = await prisma.cliente.create({
      data: {
        cd_cpf: dados.cpf,
        nm_nome_cliente: dados.nm_nome_cliente,
        dt_nascimento: dados.dt_nascimento ? new Date(dados.dt_nascimento) : new Date(),
        cd_telefone: dados.cd_telefone,
        cd_DDD: dados.cd_DDD,
        nm_email: dados.nm_email,
        cd_senha: dados.cd_senha || "123456",
        cd_genero: Number(dados.cd_genero) || 1,
        cd_tipo_telefone: Number(dados.cd_tipo_telefone) || 1,
        cd_status: 1,
        // ADICIONE ESTA LINHA ABAIXO:
        nm_identificacao_telefone: dados.nm_identificacao_telefone || "Celular",

        // Localize o app.post("/clientes") e altere o bloco de endereços:
        enderecos: {
          create: dados.enderecos.map((end: any) => ({
            nm_identificacao: end.nm_identificacao || "Casa", // <--- ADICIONE ESTA LINHA
            cd_cep: end.cd_cep,
            nm_logradouro: end.nm_logradouro,
            cd_numero: end.cd_numero,
            nm_bairro: end.nm_bairro,
            nm_cidade: end.nm_cidade,
            sg_estado: end.sg_uf || "SP",
            nm_tipo_endereco: end.nm_tipo_endereco || "Ambos",
          }))
        },

        cartoes: {
          create: dados.cartoes.map((c: any) => ({
            cd_numero_cartao: c.cd_numero_cartao,
            nm_nome_impresso_cartao: c.nm_nome_impresso_cartao,
            cd_seguranca: c.cd_seguranca,
            dt_validade_cartao: new Date(c.dt_validade_cartao),
            cd_bandeira: Number(c.cd_bandeira),
            cartao_preferencial: c.cartao_preferencial ?? false
          }))
        }


      },
    });

    res.status(201).json(newCliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar cliente" });
  }
});

// 2. Listar todos
app.get("/clientes", async (req: Request, res: Response) => {
  try {
    const clientes = await prisma.cliente.findMany({
      include: {
        genero: true,
        tipo_telefone: true,
        status_cliente: true,

        // 🔥 adicionando endereços
        enderecos: true,

        // 🔥 adicionando cartões + bandeira
        cartoes: {
          include: {
            bandeira: true
          }
        }
      },
    });
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar clientes" });
  }
});

// 3. Buscar por CPF
app.get("/clientes/:cpf", async (req: Request<{ cpf: string }>, res: Response) => {
  try {
    const { cpf } = req.params;
    const cliente = await prisma.cliente.findUnique({
      where: { cd_cpf: cpf.trim() }, //trim remove os espaços em branco
      include: {
        genero: true,
        tipo_telefone: true,
        status_cliente: true,
        enderecos: true,
        cartoes: {
          include: {
            bandeira: true
          }
        }
      },
    });

    if (!cliente) return res.status(404).json({ message: "Cliente não encontrado." });

    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar cliente" });
  }
});

// 4. ATUALIZAR (Atualizado)

app.put("/clientes/:cpf", async (req: Request<{ cpf: string }>, res: Response) => {
  try {
    const cpf = req.params.cpf.trim();
    const dados = req.body;

    // 1. Objeto de atualização básica
    const updateData: any = {
      nm_nome_cliente: dados.nm_nome_cliente,
      dt_nascimento: dados.dt_nascimento ? new Date(dados.dt_nascimento) : undefined,
      cd_genero: Number(dados.cd_genero),
      cd_status: Number(dados.cd_status),
      cd_tipo_telefone: Number(dados.cd_tipo_telefone),
      cd_DDD: dados.cd_DDD,
      cd_telefone: dados.cd_telefone,
    };

    if (dados.nm_senha && dados.nm_senha.trim() !== "") {
      updateData.cd_senha = dados.nm_senha;
    }

    const resultado = await prisma.$transaction(async (tx) => {
      // Remove registros antigos para evitar duplicidade ou lixo
      await tx.endereco.deleteMany({ where: { cd_cpf: cpf } });
      await tx.cartao_credito.deleteMany({ where: { cd_cpf: cpf } });

      return await tx.cliente.update({
        where: { cd_cpf: cpf },
        data: {
          ...updateData,
          // O segredo: usamos (dados.enderecos || []) para nunca dar undefined.map
          // Dentro do prisma.$transaction no PUT
          // Localize o app.put("/clientes/:cpf") e altere o map dentro da transação:
          enderecos: {
            create: (dados.enderecos || []).map((end: any) => ({
              nm_identificacao: end.nm_identificacao || "Casa", // <--- ADICIONE ESTA LINHA
              cd_cep: end.cd_cep,
              nm_logradouro: end.nm_logradouro,
              cd_numero: end.cd_numero,
              nm_bairro: end.nm_bairro,
              nm_cidade: end.nm_cidade,
              sg_estado: end.sg_uf || end.sg_estado || "SP",
              nm_tipo_endereco: end.nm_tipo_endereco || "Entrega"
            }))
          },
          cartoes: {
            create: (dados.cartoes || []).map((c: any) => ({
              cd_numero_cartao: c.cd_numero_cartao,
              nm_nome_impresso_cartao: c.nm_nome_impresso_cartao,
              cd_seguranca: c.cd_seguranca || "000", // Evita erro se o campo sumir na edição
              dt_validade_cartao: new Date(c.dt_validade_cartao),
              cd_bandeira: Number(c.cd_bandeira || 1),
              cartao_preferencial: !!c.cartao_preferencial // Garante que é booleano
            }))
          }
        }
      });
    });

    console.log("Cliente atualizado com sucesso!");
    res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO UPDATE:", error);
    res.status(500).json({ message: "Erro ao atualizar cliente" });
  }
});

// 5. Deletar (Atualizado para remover endereço)
app.delete("/clientes/:cpf", async (req: Request<{ cpf: string }>, res: Response) => {
  try {
    const { cpf } = req.params;

    // 🔥 remove cartões primeiro
    await prisma.$transaction(async (tx) => {

      await tx.cartao_credito.deleteMany({
        where: { cd_cpf: cpf }
      });

      await tx.endereco.deleteMany({
        where: { cd_cpf: cpf }
      });

      await tx.cliente.delete({
        where: { cd_cpf: cpf }
      });

    });

    res.status(200).json({
      message: "Cliente, endereços e cartões deletados com sucesso."
    });

  } catch (error) {
    console.error("Erro ao deletar:", error);
    res.status(500).json({ message: "Erro ao deletar. Verifique se o cliente possui pedidos vinculados." });
  }
});


app.post("/pedidos", async (req: Request, res: Response) => {
  try {
    const {
      cpf,
      cd_endereco,
      cd_modalidade, // Agora recebemos o ID da modalidade de frete
      itens,         // Cada item agora deve ter: cd_produto, qt_item, vl_unitario, nm_tamanho
      pagamentos,    // Array de { cd_cartao, vl_pago }
      cupons         // Array de códigos (strings)
    } = req.body;

    const resultado = await prisma.$transaction(async (tx) => {

      // 1. Buscar valor real do Frete no Banco
      const modalidade = await tx.modalidade_Frete.findUnique({
        where: { cd_modalidade: Number(cd_modalidade) }
      });
      if (!modalidade) throw new Error("Modalidade de frete inválida");
      const vl_frete = Number(modalidade.vl_fixo);

      // 2. Calcular total dos itens
      const vl_total_itens = itens.reduce((acc: number, item: any) =>
        acc + (Number(item.vl_unitario) * item.qt_item), 0);

      // 3. Validar Cupons e Calcular Desconto
      let total_desconto = 0;
      const cuponsParaVincular = [];

      if (cupons && cupons.length > 0) {
        for (const codigo of cupons) {
          const cupomDb = await tx.cupom.findUnique({ where: { nm_codigo: codigo } });

          if (cupomDb && cupomDb.fl_ativo) {
            total_desconto += Number(cupomDb.vl_desconto);
            cuponsParaVincular.push(cupomDb);
          }
        }
      }

      // 4. Valor final do pedido
      const vl_total_pedido = (vl_total_itens + vl_frete) - total_desconto;

      // 5. Criar o Pedido
      const novoPedido = await tx.pedido.create({
        data: {
          cd_cpf: cpf,
          cd_endereco: cd_endereco,
          cd_modalidade: cd_modalidade,
          vl_total: vl_total_pedido,
          vl_frete: vl_frete,
          cd_status_pedido: 1, // "Em Processamento"

          // Itens com Tamanho
          itens: {
            create: itens.map((i: any) => ({
              cd_produto: i.cd_produto,
              qt_item: i.qt_item,
              vl_unitario: i.vl_unitario,
              nm_tamanho: i.nm_tamanho // Agora salvando o tamanho (P, M, G...)
            }))
          },

          // Pagamentos (Múltiplos cartões)
          pagamentos: {
            create: pagamentos.map((p: any) => ({
              cd_cartao: p.cd_cartao,
              vl_pago: p.vl_pago
            }))
          }
        }
      });

      // 6. Vincular Cupons e desativar se for Cupom de TROCA
      for (const cupom of cuponsParaVincular) {
        await tx.cupom_Pedido.create({
          data: {
            cd_pedido: novoPedido.cd_pedido,
            cd_cupom: cupom.cd_cupom
          }
        });

        if (cupom.tp_cupom === "TROCA") {
          await tx.cupom.update({
            where: { cd_cupom: cupom.cd_cupom },
            data: { fl_ativo: false }
          });
        }
      }

      return novoPedido;
    });

    res.status(201).json(resultado);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || "Erro ao processar compra" });
  }
});

// 6. Listar Produtos (Para a Home e Carrinho)
app.get("/produtos", async (req: Request, res: Response) => {
  try {
    const produtos = await prisma.produto.findMany({
      where: {
        // Opcional: você pode adicionar um campo 'fl_ativo' no futuro
      }
    });
    res.status(200).json(produtos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar produtos" });
  }
});

// 7. Buscar um produto específico (Opcional, mas útil para a página de detalhes)
app.get("/produtos/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const produto = await prisma.produto.findUnique({
      where: { cd_produto: Number(id) }
    });
    if (!produto) return res.status(404).json({ message: "Produto não encontrado" });
    res.status(200).json(produto);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar detalhes do produto" });
  }
});

// Listar modalidades de frete (necessário para o checkout)
app.get("/fretes", async (req: Request, res: Response) => {
  try {
    const modalidades = await prisma.modalidade_Frete.findMany();
    res.status(200).json(modalidades);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar modalidades de frete" });
  }
});

// Listar pedidos do cliente (necessário para a tela de pedidos)
app.get("/pedidos/:cpf", async (req: Request<{ cpf: string }>, res: Response) => {
  try {
    const { cpf } = req.params;
    const pedidos = await prisma.pedido.findMany({
      where: { cd_cpf: cpf },
      include: {
        itens: { include: { produto: true } },
        pagamentos: { include: { cartao: { include: { bandeira: true } } } },
        cupons_usados: { include: { cupom: true } },
        modalidade: true,
        status_pedido: true,
        endereco_entrega: true,
      },
      orderBy: { dt_pedido: "desc" }
    });
    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar pedidos" });
  }
});

// Validar cupom antes de finalizar compra
app.get("/cupons/:codigo", async (req: Request<{ codigo: string }>, res: Response) => {
  try {
    const { codigo } = req.params;
    const cupom = await prisma.cupom.findUnique({
      where: { nm_codigo: codigo }
    });

    if (!cupom || !cupom.fl_ativo) {
      res.status(404).json({ message: "Cupom inválido ou expirado." });
      return;
    }

    res.status(200).json(cupom);
  } catch (error) {
    res.status(500).json({ message: "Erro ao validar cupom" });
  }
});

// --- ROTA DE LOGIN ---

app.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, senha, nm_email, cd_senha } = req.body;

    // Como no front você pode estar enviando 'email' ou 'nm_email'
    // vamos garantir que pegamos o valor correto
    const emailLogin = email || nm_email;
    const senhaLogin = senha || cd_senha;

    if (!emailLogin || !senhaLogin) {
      return res.status(400).json({ message: "E-mail e senha são obrigatórios." });
    }

    // Busca o cliente pelo e-mail
    const cliente = await prisma.cliente.findFirst({
      where: {
        nm_email: emailLogin,
      },
    });

    // Verifica se o cliente existe e se a senha confere
    // NOTA: Se você estiver usando Bcrypt, aqui deve usar o bcrypt.compare
    if (!cliente || cliente.cd_senha !== senhaLogin) {
      return res.status(401).json({ message: "E-mail ou senha incorretos." });
    }

    // Se chegou aqui, login deu certo
    // Retornamos os dados básicos do cliente (sem a senha por segurança)
    const { cd_senha: _, ...clienteSemSenha } = cliente;

    res.status(200).json(clienteSemSenha);

  } catch (error) {
    console.error("Erro no Login:", error);
    res.status(500).json({ message: "Erro interno no servidor ao tentar logar." });
  }
});

app.post('/cartoes', async (req, res) => {
    const { cd_cpf_cliente, cd_numero_cartao, nm_nome_impresso_cartao, cd_cvv_cartao, dt_validade_cartao, cd_bandeira } = req.body;

    try {
        await prisma.cartao_credito.create({
            data: {
                cd_cpf: cd_cpf_cliente,
                cd_numero_cartao: cd_numero_cartao,
                nm_nome_impresso_cartao: nm_nome_impresso_cartao,
                cd_seguranca: cd_cvv_cartao,
                dt_validade_cartao: new Date(dt_validade_cartao),
                cd_bandeira: Number(cd_bandeira),
                cartao_preferencial: false
            }
        });

        res.status(201).json({ message: "Cartão adicionado com sucesso!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao salvar cartão" });
    }
});

// Rota para adicionar apenas um endereço novo
app.post("/enderecos", async (req, res) => {
  try {
    const {
      nm_identificacao, // Pegue o apelido vindo do front
      nm_tipo_endereco,
      cd_cep,
      nm_logradouro,
      cd_numero,
      nm_bairro,
      nm_cidade,
      sg_estado,
      fk_cliente_cpf
    } = req.body;

    const novoEnd = await prisma.endereco.create({
      data: {
        nm_identificacao, // Salve aqui
        nm_tipo_endereco,
        cd_cep,
        nm_logradouro,
        cd_numero,
        nm_bairro,
        nm_cidade,
        sg_estado,
        cd_cpf: fk_cliente_cpf
      }
    });

    res.status(201).json(novoEnd);
  } catch (error) {
    res.status(500).json({ message: "Erro ao cadastrar endereço" });
  }
});



app.listen(3000, () => console.log("Servidor ON na 3000"));

import express, { type Request, type Response } from "express";
import { connection, prisma } from "./src/db.js"; // Import simplificado
import cors from "cors";
import { gerarRespostaChatbot } from './aiService.js';

const app = express();
app.use(express.json());
app.use(cors());
connection();
// No seu index.ts (backend)
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir arquivos da pasta que contém homepage.html, assistente.html, etc.
app.use(express.static(path.join(__dirname, '../Front-End/costumerSide')));
// Rota para o Chatbot da IA
app.post('/api/chatbot', async (req, res) => {
  try {
    // O frontend (assistente.html) vai enviar o histórico de mensagens
    const { historico } = req.body;

    if (!historico || !Array.isArray(historico)) {
      return res.status(400).json({ erro: "Histórico de conversa inválido ou ausente." });
    }

    const respostaIA = await gerarRespostaChatbot(historico);

    // Devolve a resposta estruturada para o frontend
    return res.json({ resposta: respostaIA });

  } catch (error) {
    console.error("Erro na rota do chatbot:", error);
    return res.status(500).json({ erro: "Erro interno no servidor do chatbot." });
  }
});

// 1. Criar cliente
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
        nm_identificacao_telefone: dados.nm_identificacao_telefone || "Celular",

        enderecos: {
          create: dados.enderecos.map((end: any) => ({
            nm_identificacao: end.nm_identificacao || "Casa",
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

        enderecos: true,

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
      where: { cd_cpf: cpf.trim() },
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

// 4. ATUALIZAR

app.put("/clientes/:cpf", async (req: Request<{ cpf: string }>, res: Response) => {
  try {
    const cpf = req.params.cpf.trim();
    const dados = req.body;

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
      await tx.endereco.deleteMany({ where: { cd_cpf: cpf } });
      await tx.cartao_credito.deleteMany({ where: { cd_cpf: cpf } });

      return await tx.cliente.update({
        where: { cd_cpf: cpf },
        data: {
          ...updateData,
          enderecos: {
            create: (dados.enderecos || []).map((end: any) => ({
              nm_identificacao: end.nm_identificacao || "Casa",
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
              cd_seguranca: c.cd_seguranca || "000",
              dt_validade_cartao: new Date(c.dt_validade_cartao),
              cd_bandeira: Number(c.cd_bandeira || 1),
              cartao_preferencial: !!c.cartao_preferencial
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

// 5. Deletar
app.delete("/clientes/:cpf", async (req: Request<{ cpf: string }>, res: Response) => {
  try {
    const { cpf } = req.params;
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
      cd_modalidade,
      itens,
      pagamentos,
      cupons
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
          cd_status_pedido: 1,

          itens: {
            create: itens.map((i: any) => ({
              cd_produto: i.cd_produto,
              qt_item: i.qt_item,
              vl_unitario: i.vl_unitario,
              nm_tamanho: i.nm_tamanho
            }))
          },


          pagamentos: {
            create: pagamentos.map((p: any) => ({
              cd_cartao: p.cd_cartao,
              vl_pago: p.vl_pago
            }))
          }
        }
      });

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

// 6. Listar Produtos
app.get("/produtos", async (req: Request, res: Response) => {
  try {
    const produtos = await prisma.produto.findMany({
      where: {
      }
    });
    res.status(200).json(produtos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar produtos" });
  }
});

// 7. Buscar um produto específico
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

// Listar modalidades de frete 
app.get("/fretes", async (req: Request, res: Response) => {
  try {
    const modalidades = await prisma.modalidade_Frete.findMany();
    res.status(200).json(modalidades);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar modalidades de frete" });
  }
});

app.get("/pedidos", async (req: Request, res: Response) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      include: {
        cliente: { select: { nm_nome_cliente: true, cd_cpf: true } },
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
    res.status(500).json({ message: "Erro ao buscar todos os pedidos" });
  }
});

app.patch("/pedidos/:id/status", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { cd_status_pedido } = req.body;

    const pedido = await prisma.pedido.update({
      where: { cd_pedido: Number(id) },
      data: { cd_status_pedido: Number(cd_status_pedido) }
    });

    res.status(200).json(pedido);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar status do pedido" });
  }
});

// Listar pedidos do cliente 
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

// Validar cupom
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
    if (!cliente || cliente.cd_senha !== senhaLogin) {
      return res.status(401).json({ message: "E-mail ou senha incorretos." });
    }

    // Retorna os dados do cliente
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

app.post("/enderecos", async (req, res) => {
  try {
    const {
      nm_identificacao,
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
        nm_identificacao,
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


//troca

app.post("/trocas", async (req: Request, res: Response) => {
  try {
    const { cd_pedido, cd_item, motivo, descricao } = req.body;

    // Validação básica
    if (!cd_pedido || !motivo) {
      return res.status(400).json({ message: "Pedido e motivo são obrigatórios." });
    }

    // Cria a troca com status "Pendente" (cd_status_troca = 1)
    const novatroca = await prisma.troca.create({
      data: {
        cd_pedido: Number(cd_pedido),
        cd_item: cd_item ? Number(cd_item) : null, // opcional
        ds_motivo: motivo,
        ds_descricao: descricao || null,
        cd_status_troca: 1, // 1 = Pendente (verificar Status_troca)
      },
    });

    res.status(201).json(novatroca);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao solicitar troca." });
  }
});

app.get("/trocas", async (req: Request, res: Response) => {
  try {
    const trocas = await prisma.troca.findMany({
      include: {
        pedido: {
          select: {
            cd_pedido: true,
            dt_pedido: true,
            cliente: { select: { nm_nome_cliente: true } },
          },
        },
        item: {
          include: {
            produto: { select: { nm_produto: true, nm_imagem_url: true } },
          },
        },
        status_troca: true,
      },
      orderBy: { dt_solicitacao: "desc" },
    });

    // Formata a saída para facilitar o front-end
    const resultado = trocas.map((t) => ({
      cd_troca: t.cd_troca,
      dt_solicitacao: t.dt_solicitacao,
      motivo: t.ds_motivo,
      descricao: t.ds_descricao,
      status: t.status_troca.nm_status,
      pedido: {
        numero: t.pedido.cd_pedido,
        cliente: t.pedido.cliente?.nm_nome_cliente,
      },
      item: t.item
        ? {
          nome: t.item.produto?.nm_produto,
          imagem: t.item.produto?.nm_imagem_url,
          tamanho: t.item.nm_tamanho,
        }
        : null,
    }));

    res.status(200).json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao listar trocas." });
  }
});

app.patch("/trocas/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { cd_status_troca } = req.body;

    if (!cd_status_troca) {
      return res.status(400).json({ message: "Novo status é obrigatório." });
    }

    const troca = await prisma.troca.update({
      where: { cd_troca: Number(id) },
      data: { cd_status_troca: Number(cd_status_troca) },
      include: {
        item: {
          include: { produto: true }
        },
        pedido: { select: { cd_pedido: true, vl_total: true } }
      }
    });

    // Se foi autorizada e ainda não tem cupom vinculado
    if (Number(cd_status_troca) === 4 && !troca.cd_cupom) {
      const valorCupom = troca.item?.vl_unitario || troca.pedido?.vl_total || 0;
      const codigo = `TROCA-${troca.cd_troca}-${Date.now()}`;

      const novoCupom = await prisma.cupom.create({
        data: {
          nm_codigo: codigo,
          vl_desconto: valorCupom,
          tp_cupom: "TROCA",
          fl_ativo: true
        }
      });

      // Vincula o cupom à troca
      await prisma.troca.update({
        where: { cd_troca: troca.cd_troca },
        data: { cd_cupom: novoCupom.cd_cupom }
      });
    }

    res.status(200).json(troca);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar status da troca." });
  }
});

// Obter detalhes de uma troca específica
app.get("/trocas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const troca = await prisma.troca.findUnique({
      where: { cd_troca: Number(id) },
      include: {
        pedido: {
          select: {
            cd_pedido: true,
            dt_pedido: true,
            vl_total: true,
            cliente: { select: { nm_nome_cliente: true, cd_cpf: true } },
          },
        },
        item: {
          include: {
            produto: { select: { nm_produto: true, nm_imagem_url: true } },
          },
        },
        status_troca: true,
        cupom: true
      },
    });

    if (!troca) {
      return res.status(404).json({ message: "Troca não encontrada." });
    }

    // Formata a resposta para facilitar o front‑end
   const resultado = {
  cd_troca: troca.cd_troca,
  dt_solicitacao: troca.dt_solicitacao,
  motivo: troca.ds_motivo,
  descricao: troca.ds_descricao,
  status: troca.status_troca.nm_status,
  cd_status: troca.cd_status_troca,
  pedido: {
    numero: troca.pedido.cd_pedido,
    data: troca.pedido.dt_pedido,
    valor: troca.pedido.vl_total,
    cliente: troca.pedido.cliente?.nm_nome_cliente,
    cpf: troca.pedido.cliente?.cd_cpf,
  },
  item: troca.item ? {
    cd_item: troca.item.cd_item,
    nome: troca.item.produto?.nm_produto,
    imagem: troca.item.produto?.nm_imagem_url,
    tamanho: troca.item.nm_tamanho,
    quantidade: troca.item.qt_item,
    valor_unitario: troca.item.vl_unitario,
  } : null,
  cupom: troca.cupom ? {
    codigo: troca.cupom.nm_codigo,
    valor: troca.cupom.vl_desconto,
    ativo: troca.cupom.fl_ativo
  } : null
};

    res.status(200).json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar detalhes da troca." });
  }
});

app.listen(3000, () => console.log("Servidor ON na 3000"));



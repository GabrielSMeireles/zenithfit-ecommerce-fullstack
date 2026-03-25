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
        
        enderecos: {
          create: dados.enderecos.map((end: any) => ({
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

    // 1. Criamos o objeto de atualização do Cliente (dados básicos)
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

    // 2. EXCUÇÃO EM TRANSAÇÃO (Garante que ou faz tudo ou não faz nada)
    const resultado = await prisma.$transaction(async (tx) => {
      
      // Deleta todos os endereços atuais do cliente
      await tx.endereco.deleteMany({
        where: { cd_cpf: cpf }
      });

      // Atualiza o cliente e RECRIA os endereços enviados pelo Front-end
      return await tx.cliente.update({
        where: { cd_cpf: cpf },
        data: {
          ...updateData,
          enderecos: {
            create: dados.enderecos.map((end: any) => ({
              cd_cep: end.cd_cep,
              nm_logradouro: end.nm_logradouro,
              cd_numero: end.cd_numero,
              nm_bairro: end.nm_bairro,
              nm_cidade: end.nm_cidade,
              sg_estado: end.sg_uf,
              nm_tipo_endereco: end.nm_tipo_endereco
            }))
          }
        }
      });
    });

      await tx.cartao_credito.deleteMany({
        where: { cd_cpf: cpf }
      });

      cartoes: {
        create: dados.cartoes.map((c: any) => ({
          cd_numero_cartao: c.cd_numero_cartao,
          nm_nome_impresso_cartao: c.nm_nome_impresso_cartao,
          cd_seguranca: c.cd_seguranca,
          dt_validade_cartao: new Date(c.dt_validade_cartao),
          cd_bandeira: Number(c.cd_bandeira),
          cartao_preferencial: c.cartao_preferencial
        }))
      }

    console.log("Cliente e múltiplos endereços atualizados com sucesso!");
    res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO NO UPDATE:", error);
    res.status(500).json({ message: "Erro ao atualizar cliente e endereços" });
  }
});

// 5. Deletar (Atualizado para remover endereço)
app.delete("/clientes/:cpf", async (req: Request<{ cpf: string }>, res: Response) => {
  try {
    const { cpf } = req.params;

    // 🔥 remove cartões primeiro
    await tx.cartao_credito.deleteMany({
      where: { cd_cpf: cpf }
    });

   //Remove o endereço
    await prisma.endereco.deleteMany({
      where: { cd_cpf: cpf }
    });

    //remove o cliente
    await prisma.cliente.delete({ 
      where: { cd_cpf: cpf } 
    });

    res.status(200).json({
      message: "Cliente, endereços e cartões deletados com sucesso."
    });

  } catch (error) {
    console.error("Erro ao deletar:", error);
    res.status(500).json({ message: "Erro ao deletar. Verifique se o cliente possui pedidos vinculados." });
  }
});

app.listen(3000, () => console.log("Servidor ON na 3000"));
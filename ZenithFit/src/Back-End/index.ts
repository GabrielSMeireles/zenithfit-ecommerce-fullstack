import express, { type Request, type Response } from "express";
import { connection } from "./src/db.js";
import { prisma } from "./src/db.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
connection();

// Criar cliente
app.post("/clientes", async (req: Request, res: Response) => {
  try {
    const {
      cpf,
      name,
      nascimento,
      telefone,
      ddd,
      identificacao_telefone,
      email,
      password,
      genero,
      tipo_telefone,
    } = req.body;

    if (!cpf || !name || !nascimento || !telefone || !ddd || !identificacao_telefone || !email || !password || !genero || !tipo_telefone) {
      res.status(400).json({ message: "Todos os campos são obrigatórios." });
      return;
    }

    const clienteExistente = await prisma.cliente.findFirst({
      where: { nm_email: email },
    });

    if (clienteExistente) {
      res.status(409).json({ message: "Email já cadastrado." });
      return;
    }

    const cpfExistente = await prisma.cliente.findUnique({
      where: { cd_cpf: cpf },
    });

    if (cpfExistente) {
      res.status(409).json({ message: "CPF já cadastrado." });
      return;
    }

    const newCliente = await prisma.cliente.create({
      data: {
        cd_cpf:                    cpf,
        nm_nome_cliente:           name,
        dt_nascimento:             new Date(nascimento),
        cd_telefone:               telefone,
        cd_DDD:                    ddd,
        nm_identificacao_telefone: identificacao_telefone,
        nm_email:                  email,
        cd_senha:                  password,
        cd_rank_cliente:           0,
        cd_genero:                 genero,
        cd_tipo_telefone:          tipo_telefone,
        cd_status:                 1,
      },
    });

    res.status(201).json(newCliente);
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor" });
  }
});

// Listar todos os clientes
app.get("/clientes", async (req: Request, res: Response) => {
  try {
    const clientes = await prisma.cliente.findMany({
      include: {
        genero:         true,
        tipo_telefone:  true,
        status_cliente: true,
      },
    });
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor" });
  }
});

// Buscar cliente por CPF
app.get("/clientes/:cpf", async (req: Request<{ cpf: string }>, res: Response) => {
  try {
    const { cpf } = req.params;

    const cliente = await prisma.cliente.findUnique({
      where: { cd_cpf: cpf },
      include: {
        genero:         true,
        tipo_telefone:  true,
        status_cliente: true,
      },
    });

    if (!cliente) {
      res.status(404).json({ message: "Cliente não encontrado." });
      return;
    }

    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor" });
  }
});

// Atualizar cliente
app.put("/clientes/:cpf", async (req: Request<{ cpf: string }>, res: Response) => {
  try {
    const { cpf } = req.params;
    const {
      name,
      nascimento,
      telefone,
      ddd,
      identificacao_telefone,
      email,
      password,
      genero,
      tipo_telefone,
      status,
    } = req.body;

    const cliente = await prisma.cliente.findUnique({
      where: { cd_cpf: cpf },
    });

    if (!cliente) {
      res.status(404).json({ message: "Cliente não encontrado." });
      return;
    }

    const clienteAtualizado = await prisma.cliente.update({
      where: { cd_cpf: cpf },
      data: {
        nm_nome_cliente:           name                   ?? cliente.nm_nome_cliente,
        dt_nascimento:             nascimento             ? new Date(nascimento) : cliente.dt_nascimento,
        cd_telefone:               telefone               ?? cliente.cd_telefone,
        cd_DDD:                    ddd                    ?? cliente.cd_DDD,
        nm_identificacao_telefone: identificacao_telefone ?? cliente.nm_identificacao_telefone,
        nm_email:                  email                  ?? cliente.nm_email,
        cd_senha:                  password               ?? cliente.cd_senha,
        cd_genero:                 genero                 ?? cliente.cd_genero,
        cd_tipo_telefone:          tipo_telefone          ?? cliente.cd_tipo_telefone,
        cd_status:                 status                 ?? cliente.cd_status,
      },
    });

    res.status(200).json(clienteAtualizado);
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor" });
  }
});

// Deletar cliente
app.delete("/clientes/:cpf", async (req: Request<{ cpf: string }>, res: Response) => {
  try {
    const { cpf } = req.params;

    const cliente = await prisma.cliente.findUnique({
      where: { cd_cpf: cpf },
    });

    if (!cliente) {
      res.status(404).json({ message: "Cliente não encontrado." });
      return;
    }

    await prisma.cliente.delete({
      where: { cd_cpf: cpf },
    });

    res.status(200).json({ message: "Cliente deletado com sucesso." });
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor" });
  }
});

// Atualizar cliente por CPF
app.put("/clientes/:cpf", async (req, res) => {
    try {
        const { cpf } = req.params;
        const dados = req.body;

        const clienteAtualizado = await prisma.cliente.update({
            where: { cd_cpf: cpf },
            data: {
                nm_nome_cliente: dados.name,
                dt_nascimento: new Date(dados.nascimento),
                cd_telefone: dados.telefone,
                cd_DDD: dados.ddd,
                nm_email: dados.email,
                cd_genero: parseInt(dados.genero),
                // Adicione outros campos conforme seu schema
            },
        });
        res.status(200).json(clienteAtualizado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao atualizar cliente" });
    }
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
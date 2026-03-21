import express, {} from "express";
import { connection } from "./src/db.js";
import { prisma } from "./src/db.js";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());
connection();
// --- ROTAS ---
// 1. Criar cliente
app.post("/clientes", async (req, res) => {
    try {
        const { cpf, name, nascimento, telefone, ddd, identificacao_telefone, email, password, genero, tipo_telefone, } = req.body;
        if (!cpf || !name || !nascimento || !telefone || !ddd || !email || !password) {
            res.status(400).json({ message: "Campos obrigatórios faltando." });
            return;
        }
        const cpfExistente = await prisma.cliente.findUnique({ where: { cd_cpf: cpf } });
        if (cpfExistente) {
            res.status(409).json({ message: "CPF já cadastrado." });
            return;
        }
        const newCliente = await prisma.cliente.create({
            data: {
                cd_cpf: cpf,
                nm_nome_cliente: name,
                dt_nascimento: new Date(nascimento),
                cd_telefone: telefone,
                cd_DDD: ddd,
                nm_identificacao_telefone: identificacao_telefone,
                nm_email: email,
                cd_senha: password,
                cd_rank_cliente: 0,
                cd_genero: Number(genero),
                cd_tipo_telefone: Number(tipo_telefone),
                cd_status: 1,
            },
        });
        res.status(201).json(newCliente);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao criar cliente" });
    }
});
// 2. Listar todos os clientes
app.get("/clientes", async (req, res) => {
    try {
        const clientes = await prisma.cliente.findMany({
            include: { genero: true, tipo_telefone: true, status_cliente: true },
        });
        res.status(200).json(clientes);
    }
    catch (error) {
        res.status(500).json({ message: "Erro ao listar clientes" });
    }
});
// 3. Buscar cliente por CPF (Onde estava dando erro)
app.get("/clientes/:cpf", async (req, res) => {
    try {
        const { cpf } = req.params;
        const cliente = await prisma.cliente.findUnique({
            where: { cd_cpf: cpf.trim() },
            include: { genero: true, tipo_telefone: true, status_cliente: true },
        });
        if (!cliente) {
            res.status(404).json({ message: "Cliente não encontrado." });
            return;
        }
        res.status(200).json(cliente);
    }
    catch (error) {
        res.status(500).json({ message: "Erro ao buscar cliente" });
    }
});
// 4. Atualizar cliente (Versão ÚNICA e completa)
app.put("/clientes/:cpf", async (req, res) => {
    try {
        const { cpf } = req.params;
        const dados = req.body;
        const clienteExistente = await prisma.cliente.findUnique({ where: { cd_cpf: cpf } });
        if (!clienteExistente) {
            res.status(404).json({ message: "Cliente não encontrado para atualização." });
            return;
        }
        const clienteAtualizado = await prisma.cliente.update({
            where: { cd_cpf: cpf },
            data: {
                nm_nome_cliente: dados.name ?? clienteExistente.nm_nome_cliente,
                dt_nascimento: dados.nascimento ? new Date(dados.nascimento) : clienteExistente.dt_nascimento,
                cd_telefone: dados.telefone ?? clienteExistente.cd_telefone,
                cd_DDD: dados.ddd ?? clienteExistente.cd_DDD,
                nm_email: dados.email ?? clienteExistente.nm_email,
                cd_genero: dados.genero ? Number(dados.genero) : clienteExistente.cd_genero,
                cd_tipo_telefone: dados.tipo_telefone ? Number(dados.tipo_telefone) : clienteExistente.cd_tipo_telefone,
                cd_status: dados.status ? Number(dados.status) : clienteExistente.cd_status,
            },
        });
        res.status(200).json(clienteAtualizado);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao atualizar cliente" });
    }
});
// 5. Deletar cliente
app.delete("/clientes/:cpf", async (req, res) => {
    try {
        const { cpf } = req.params;
        await prisma.cliente.delete({ where: { cd_cpf: cpf } });
        res.status(200).json({ message: "Cliente deletado com sucesso." });
    }
    catch (error) {
        res.status(500).json({ message: "Erro ao deletar cliente" });
    }
});
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
//# sourceMappingURL=index.js.map
import express, {} from "express";
import { connection, prisma } from "./src/db.js"; // Import simplificado
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());
connection();
// --- ROTAS ---
// 1. Criar cliente - CORRIGIDO (Campos obrigatórios do Prisma)
app.post("/clientes", async (req, res) => {
    try {
        const dados = req.body;
        const cpfExistente = await prisma.cliente.findUnique({ where: { cd_cpf: dados.cpf } });
        if (cpfExistente) {
            return res.status(409).json({ message: "CPF já cadastrado." });
        }
        const newCliente = await prisma.cliente.create({
            data: {
                cd_cpf: dados.cpf,
                nm_nome_cliente: dados.nm_nome_cliente,
                // Garante que dt_nascimento receba uma Date e nunca null
                dt_nascimento: dados.dt_nascimento ? new Date(dados.dt_nascimento) : new Date(),
                cd_telefone: dados.cd_telefone,
                cd_DDD: dados.cd_DDD,
                nm_email: dados.nm_email,
                cd_senha: dados.cd_senha || "123456",
                cd_rank_cliente: 0,
                cd_genero: Number(dados.cd_genero) || 1,
                cd_tipo_telefone: Number(dados.cd_tipo_telefone) || 1,
                cd_status: 1,
                // CAMPO QUE FALTAVA (conforme seu erro ts2322):
                nm_identificacao_telefone: dados.nm_identificacao_telefone || "Principal"
            },
        });
        res.status(201).json(newCliente);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao criar cliente" });
    }
});
// 2. Listar todos
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
// 3. Buscar por CPF
app.get("/clientes/:cpf", async (req, res) => {
    try {
        const { cpf } = req.params;
        const cliente = await prisma.cliente.findUnique({
            where: { cd_cpf: cpf.trim() },
            include: { genero: true, tipo_telefone: true, status_cliente: true },
        });
        if (!cliente)
            return res.status(404).json({ message: "Cliente não encontrado." });
        res.status(200).json(cliente);
    }
    catch (error) {
        res.status(500).json({ message: "Erro ao buscar cliente" });
    }
});
// 4. ATUALIZAR (Onde estava o problema de não alterar)
app.put("/clientes/:cpf", async (req, res) => {
    try {
        const { cpf } = req.params;
        const dados = req.body;
        // --- LOG DE DIAGNÓSTICO ---
        console.log("-----------------------------------------");
        console.log("CPF da URL:", cpf);
        console.log("CORPO RECEBIDO (req.body):", JSON.stringify(dados, null, 2));
        console.log("-----------------------------------------");
        const clienteExistente = await prisma.cliente.findUnique({ where: { cd_cpf: cpf } });
        if (!clienteExistente)
            return res.status(404).json({ message: "Cliente não existe." });
        const clienteAtualizado = await prisma.cliente.update({
            where: { cd_cpf: cpf },
            data: {
                nm_nome_cliente: dados.nm_nome_cliente ?? clienteExistente.nm_nome_cliente,
                dt_nascimento: dados.dt_nascimento ? new Date(dados.dt_nascimento) : clienteExistente.dt_nascimento,
                cd_telefone: dados.cd_telefone ?? clienteExistente.cd_telefone,
                cd_DDD: dados.cd_DDD ?? clienteExistente.cd_DDD,
                cd_genero: dados.cd_genero ? Number(dados.cd_genero) : clienteExistente.cd_genero,
                cd_tipo_telefone: dados.cd_tipo_telefone ? Number(dados.cd_tipo_telefone) : clienteExistente.cd_tipo_telefone,
                cd_status: dados.cd_status ? Number(dados.cd_status) : clienteExistente.cd_status,
                nm_email: dados.nm_email ?? clienteExistente.nm_email,
            },
        });
        res.status(200).json(clienteAtualizado);
    }
    catch (error) {
        console.error("Erro Prisma Update:", error);
        res.status(500).json({ message: "Erro ao atualizar" });
    }
});
// 5. Deletar
app.delete("/clientes/:cpf", async (req, res) => {
    try {
        const { cpf } = req.params;
        await prisma.cliente.delete({ where: { cd_cpf: cpf } });
        res.status(200).json({ message: "Deletado." });
    }
    catch (error) {
        res.status(500).json({ message: "Erro ao deletar." });
    }
});
app.listen(3000, () => console.log("Servidor ON na 3000"));
//# sourceMappingURL=index.js.map
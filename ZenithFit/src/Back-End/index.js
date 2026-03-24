import express, {} from "express";
import { connection, prisma } from "./src/db.js"; // Import simplificado
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());
connection();
// --- ROTAS ---
// 1. Criar cliente (Atualizado)
app.post("/clientes", async (req, res) => {
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
                nm_identificacao_telefone: dados.nm_identificacao_telefone || "Principal",
                enderecos: {
                    create: dados.enderecos.map((end) => ({
                        cd_cep: end.cd_cep,
                        nm_logradouro: end.nm_logradouro,
                        cd_numero: end.cd_numero,
                        nm_bairro: end.nm_bairro,
                        nm_cidade: end.nm_cidade,
                        sg_estado: end.sg_uf || "SP",
                    }))
                }
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
            where: { cd_cpf: cpf.trim() }, //trim remove os espaços em branco
            include: {
                genero: true,
                tipo_telefone: true,
                status_cliente: true,
                enderecos: true
            },
        });
        if (!cliente)
            return res.status(404).json({ message: "Cliente não encontrado." });
        const resposta = {
            ...cliente,
            cd_cep: cliente.enderecos[0]?.cd_cep || '',
            nm_logradouro: cliente.enderecos[0]?.nm_logradouro || '',
            cd_numero: cliente.enderecos[0]?.cd_numero || '',
            nm_bairro: cliente.enderecos[0]?.nm_bairro || '',
            nm_cidade: cliente.enderecos[0]?.nm_cidade || '',
            sg_uf: cliente.enderecos[0]?.sg_estado || ''
        };
        res.status(200).json(resposta);
    }
    catch (error) {
        res.status(500).json({ message: "Erro ao buscar cliente" });
    }
});
// 4. ATUALIZAR (Atualizado)
app.put("/clientes/:cpf", async (req, res) => {
    try {
        const cpf = req.params.cpf.trim();
        const dados = req.body;
        // DEBUG
        console.log(`Atualizando CPF: ${cpf}`);
        console.log(`Status recebido: ${dados.cd_status} (${typeof dados.cd_status})`);
        console.log(`Senha recebida: ${dados.nm_senha ? "SIM" : "NÃO"}`);
        const updateData = {
            nm_nome_cliente: dados.nm_nome_cliente,
            dt_nascimento: dados.dt_nascimento ? new Date(dados.dt_nascimento) : undefined,
            cd_genero: Number(dados.cd_genero),
            cd_status: Number(dados.cd_status),
            cd_tipo_telefone: Number(dados.cd_tipo_telefone),
            cd_DDD: dados.cd_DDD,
            cd_telefone: dados.cd_telefone,
            enderecos: {
                updateMany: {
                    where: { cd_cpf: cpf },
                    data: {
                        cd_cep: dados.cd_cep,
                        nm_logradouro: dados.nm_logradouro,
                        cd_numero: dados.cd_numero,
                        nm_bairro: dados.nm_bairro,
                        nm_cidade: dados.nm_cidade,
                        sg_estado: dados.sg_uf
                    }
                }
            }
        };
        if (dados.nm_senha && dados.nm_senha.trim() !== "") {
            updateData.cd_senha = dados.nm_senha;
        }
        const clienteAtualizado = await prisma.cliente.update({
            where: { cd_cpf: cpf },
            data: updateData
        });
        console.log("Banco de dados atualizado com sucesso!");
        res.status(200).json(clienteAtualizado);
    }
    catch (error) {
        console.error("ERRO CRÍTICO NO UPDATE:", error);
        res.status(500).json({ message: "Erro ao atualizar cliente" });
    }
});
// 5. Deletar (Atualizado para remover endereço)
app.delete("/clientes/:cpf", async (req, res) => {
    try {
        const { cpf } = req.params;
        //Remove o endereço
        await prisma.endereco.deleteMany({
            where: { cd_cpf: cpf }
        });
        //remove o cliente
        await prisma.cliente.delete({
            where: { cd_cpf: cpf }
        });
        res.status(200).json({ message: "Cliente e endereços deletados com sucesso." });
    }
    catch (error) {
        console.error("Erro ao deletar:", error);
        res.status(500).json({ message: "Erro ao deletar. Verifique se o cliente possui pedidos vinculados." });
    }
});
app.listen(3000, () => console.log("Servidor ON na 3000"));
//# sourceMappingURL=index.js.map
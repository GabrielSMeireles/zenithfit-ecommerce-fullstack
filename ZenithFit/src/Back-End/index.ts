import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { connection } from './src/db.js';

// Rotas
import clienteRoutes from './src/routes/clienteRoutes.js';
import pedidoRoutes from './src/routes/pedidoRoutes.js';
import produtoRoutes from './src/routes/produtoRoutes.js';
import trocaRoutes from './src/routes/trocaRoutes.js';
import cupomRoutes from './src/routes/cupomRoutes.js';
import chatbotRoutes from './src/routes/chatbotRoutes.js';

// Controller para login
import { ClienteController } from './src/controllers/ClienteController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

// Arquivos do Front-End
app.use(express.static(path.join(__dirname, '../Front-End/costumerSide')));

// Conecta ao banco
connection();

// Registro de rotas
app.use('/clientes', clienteRoutes);
app.use('/pedidos', pedidoRoutes);
app.use('/produtos', produtoRoutes);
app.use('/trocas', trocaRoutes);
app.use('/cupons', cupomRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Rota de login
const clienteCtrl = new ClienteController();
app.post('/login', clienteCtrl.login);

// Rotas de frete
import { prisma } from './src/db.js';
import { type Request, type Response } from 'express';
app.get('/fretes', async (_req: Request, res: Response) => {
  try {
    const modalidades = await prisma.modalidade_Frete.findMany();
    res.status(200).json(modalidades);
  } catch {
    res.status(500).json({ message: 'Erro ao buscar modalidades de frete.' });
  }
});

// Rotas de cartão/endereço
import { CartaoDAO } from './src/dao/CartaoDAO.js';
import { EnderecoDAO } from './src/dao/EnderecoDAO.js';
import { Cartao } from './src/entities/Cartao.js';
import { Endereco } from './src/entities/Endereco.js';

app.post('/cartoes', async (req: Request, res: Response) => {
  try {
    const dao = new CartaoDAO();
    const cartao = Object.assign(new Cartao(), {
      cd_cpf: req.body.cd_cpf_cliente,
      cd_numero_cartao: req.body.cd_numero_cartao,
      nm_nome_impresso_cartao: req.body.nm_nome_impresso_cartao,
      cd_seguranca: req.body.cd_cvv_cartao,
      dt_validade_cartao: new Date(req.body.dt_validade_cartao),
      cd_bandeira: Number(req.body.cd_bandeira),
      cartao_preferencial: false,
    });
    await dao.salvar(cartao);
    res.status(201).json({ message: 'Cartão adicionado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar cartão.' });
  }
});

app.post('/enderecos', async (req: Request, res: Response) => {
  try {
    const dao = new EnderecoDAO();
    const endereco = Object.assign(new Endereco(), {
      ...req.body,
      cd_cpf: req.body.fk_cliente_cpf,
    });
    const resultado = await dao.salvar(endereco);
    res.status(201).json(resultado);
  } catch {
    res.status(500).json({ message: 'Erro ao cadastrar endereço.' });
  }
});

app.listen(3000, () => console.log('🚀 Servidor ZenithFit rodando na porta 3000'));


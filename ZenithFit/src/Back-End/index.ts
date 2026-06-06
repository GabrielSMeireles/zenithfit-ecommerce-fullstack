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
import cartaoRoutes from './src/routes/cartaoRoutes.js';       
import enderecoRoutes from './src/routes/enderecoRoutes.js';  
import chatbotRoutes from './src/routes/chatbotRoutes.js';
import analiseRoutes from './src/routes/analiseRoutes.js';

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
app.use('/cartoes', cartaoRoutes);        
app.use('/enderecos', enderecoRoutes);    
app.use('/api/chatbot', chatbotRoutes);
app.use('/analises', analiseRoutes);

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

app.listen(3000, () => console.log('🚀 Servidor ZenithFit rodando na porta 3000'));

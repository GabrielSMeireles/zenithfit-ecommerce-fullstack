require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/clientes', async (req, res) => {
    const clientes = await prisma.cliente.findMany();
    res.json(clientes);
});

app.listen(3000, () => console.log("🚀 ZenithFit2 rodando na 3000"));
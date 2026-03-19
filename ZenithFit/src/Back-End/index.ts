import express, { type Request, type Response } from "express";
import {connection} from "./src/db.js";
import { prisma } from "./src/db.js";
//import cors from "cors";

const app = express();
app.use(express.json());
//app.use(cors());
connection();

app.post("/register", async (req: Request, res: Response) => {
  
  try {

    const {name, email, password, cep} = req.body;

    if(!name || !email || !password || !cep) {
        res
          .status(400)
          .json({ message: "Todos os campos são obrigatórios." });
        return;
    }

    const newUser = await prisma.cliente.create({
      data: {name: name, email: email, password: password, cep: cep},
    });

    res.json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor" });
    return;
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});

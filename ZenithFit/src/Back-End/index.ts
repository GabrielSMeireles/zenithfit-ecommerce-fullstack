import express from "express";

const app = express();

app.get("/teste", (req, res) => {
    res.json("Você acessou a rota inicial");
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});

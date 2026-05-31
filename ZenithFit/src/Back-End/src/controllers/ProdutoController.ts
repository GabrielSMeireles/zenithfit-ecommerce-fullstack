import { type Request, type Response } from "express";
import { ProdutoService } from '../services/ProdutoService.js';

export class ProdutoController {
  private service = new ProdutoService();

  listar = async (_req: Request, res: Response): Promise<void> => {
    try {
      res.status(200).json(await this.service.listarTodos());
    } catch {
      res.status(500).json({ message: 'Erro ao buscar produtos.' });
    }
  };

  buscar = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const produto = await this.service.consultar(Number(req.params.id));
      if (!produto) { res.status(404).json({ message: 'Produto não encontrado.' }); return; }
      res.status(200).json(produto);
    } catch {
      res.status(500).json({ message: 'Erro ao buscar produto.' });
    }
  };
}

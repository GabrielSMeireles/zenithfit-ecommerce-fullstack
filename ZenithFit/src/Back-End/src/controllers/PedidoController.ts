import { type Request, type Response } from "express";
import { PedidoService } from '../services/PedidoService.js';

export class PedidoController {
  private service = new PedidoService();

  criar = async (req: Request, res: Response): Promise<void> => {
    try {
      const pedido = await this.service.salvar(req.body);
      res.status(201).json(pedido);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Erro ao processar pedido.' });
    }
  };

  listar = async (_req: Request, res: Response): Promise<void> => {
    try {
      const pedidos = await this.service.listarTodos();
      res.status(200).json(pedidos);
    } catch {
      res.status(500).json({ message: 'Erro ao listar pedidos.' });
    }
  };

  listarPorCliente = async (req: Request<{ cpf: string }>, res: Response): Promise<void> => {
    try {
      const pedidos = await this.service.listarPorCliente(req.params.cpf);
      res.status(200).json(pedidos);
    } catch {
      res.status(500).json({ message: 'Erro ao buscar pedidos do cliente.' });
    }
  };

  atualizarStatus = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const pedido = await this.service.atualizarStatus(
        Number(req.params.id),
        Number(req.body.cd_status_pedido)
      );
      res.status(200).json(pedido);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Erro ao atualizar status.' });
    }
  };
}

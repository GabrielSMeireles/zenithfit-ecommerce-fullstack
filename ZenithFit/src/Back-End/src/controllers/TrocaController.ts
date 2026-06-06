import { type Request, type Response } from "express";
import { TrocaService } from '../services/TrocaService.js';

export class TrocaController {
  private service = new TrocaService();

  criar = async (req: Request, res: Response): Promise<void> => {
    try {
      const troca = await this.service.salvar(req.body);
      res.status(201).json(troca);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Erro ao solicitar troca.' });
    }
  };

  listar = async (_req: Request, res: Response): Promise<void> => {
    try {
      res.status(200).json(await this.service.listarTodas());
    } catch {
      res.status(500).json({ message: 'Erro ao listar trocas.' });
    }
  };

  buscar = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const troca = await this.service.buscar(Number(req.params.id));

      if (!troca) {
        res.status(404).json({ message: 'Troca não encontrada.' });
        return;
      }

      res.status(200).json(troca);
    } catch {
      res.status(500).json({ message: 'Erro ao buscar troca.' });
    }
  };

  atualizarStatus = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const troca = await this.service.atualizarStatus(
        Number(req.params.id),
        Number(req.body.cd_status_troca)
      );
      res.status(200).json(troca);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Erro ao atualizar status da troca.' });
    }
  };
}

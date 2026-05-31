import { type Request, type Response } from "express";
import { CupomService } from '../services/CupomService.js';

export class CupomController {
  private service = new CupomService();

  validar = async (req: Request<{ codigo: string }>, res: Response): Promise<void> => {
    try {
      const cupom = await this.service.consultarPorCodigo(req.params.codigo);
      if (!cupom) {
        res.status(404).json({ message: 'Cupom inválido ou expirado.' });
        return;
      }
      res.status(200).json(cupom);
    } catch {
      res.status(500).json({ message: 'Erro ao validar cupom.' });
    }
  };
}

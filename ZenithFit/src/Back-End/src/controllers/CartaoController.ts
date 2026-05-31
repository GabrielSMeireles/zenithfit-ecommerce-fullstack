import { type Request, type Response } from "express";
import { CartaoService } from '../services/CartaoService.js';
import { Cartao } from '../entities/Cartao.js';

export class CartaoController {
  private service = new CartaoService();

  adicionar = async (req: Request, res: Response): Promise<void> => {
    try {
      const cartao = Object.assign(new Cartao(), {
        cd_cpf: req.body.cd_cpf_cliente,
        cd_numero_cartao: req.body.cd_numero_cartao,
        nm_nome_impresso_cartao: req.body.nm_nome_impresso_cartao,
        cd_seguranca: req.body.cd_cvv_cartao,
        dt_validade_cartao: new Date(req.body.dt_validade_cartao),
        cd_bandeira: Number(req.body.cd_bandeira),
        cartao_preferencial: false,
      });

      const resultado = await this.service.salvar(cartao);
      res.status(201).json(resultado);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Erro ao adicionar cartão.' });
    }
  };

  buscar = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const cartao = await this.service.consultar(Number(req.params.id));
      if (!cartao) {
        res.status(404).json({ message: 'Cartão não encontrado.' });
        return;
      }
      res.status(200).json(cartao);
    } catch {
      res.status(500).json({ message: 'Erro ao buscar cartão.' });
    }
  };

  deletar = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      await this.service.deletar(Number(req.params.id));
      res.status(200).json({ message: 'Cartão removido com sucesso.' });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Erro ao deletar cartão.' });
    }
  };
}

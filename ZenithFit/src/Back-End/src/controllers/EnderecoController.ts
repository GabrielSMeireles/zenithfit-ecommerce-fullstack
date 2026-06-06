import { type Request, type Response } from "express";
import { EnderecoService } from '../services/EnderecoService.js';
import { Endereco } from '../entities/Endereco.js';

export class EnderecoController {
  private service = new EnderecoService();

  adicionar = async (req: Request, res: Response): Promise<void> => {
    try {
      const endereco = Object.assign(new Endereco(), {
        ...req.body,
        cd_cpf: req.body.fk_cliente_cpf,
      });

      const resultado = await this.service.salvar(endereco);
      res.status(201).json(resultado);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Erro ao cadastrar endereço.' });
    }
  };

  buscar = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const endereco = await this.service.consultar(Number(req.params.id));
      if (!endereco) {
        res.status(404).json({ message: 'Endereço não encontrado.' });
        return;
      }
      res.status(200).json(endereco);
    } catch {
      res.status(500).json({ message: 'Erro ao buscar endereço.' });
    }
  };

  deletar = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      await this.service.deletar(Number(req.params.id));
      res.status(200).json({ message: 'Endereço removido com sucesso.' });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Erro ao deletar endereço.' });
    }
  };
}

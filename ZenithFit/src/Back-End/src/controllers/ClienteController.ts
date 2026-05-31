import { type Request, type Response } from "express";
import { ClienteService } from '../services/ClienteService.js';

export class ClienteController {
  private service = new ClienteService();

  criar = async (req: Request, res: Response): Promise<void> => {
    try {
      const cliente = await this.service.salvar(req.body);
      res.status(201).json(cliente);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Erro ao criar cliente.' });
    }
  };

  listar = async (_req: Request, res: Response): Promise<void> => {
    try {
      const clientes = await this.service.listarTodos();
      res.status(200).json(clientes);
    } catch {
      res.status(500).json({ message: 'Erro ao listar clientes.' });
    }
  };

  buscar = async (req: Request<{ cpf: string }>, res: Response): Promise<void> => {
    try {
      const cliente = await this.service.consultar(req.params.cpf.trim());
      if (!cliente) { res.status(404).json({ message: 'Cliente não encontrado.' }); return; }
      res.status(200).json(cliente);
    } catch {
      res.status(500).json({ message: 'Erro ao buscar cliente.' });
    }
  };

  atualizar = async (req: Request<{ cpf: string }>, res: Response): Promise<void> => {
    try {
      const dados = { ...req.body, cd_cpf: req.params.cpf.trim() };
      const cliente = await this.service.alterar(dados);
      res.status(200).json(cliente);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Erro ao atualizar cliente.' });
    }
  };

  deletar = async (req: Request<{ cpf: string }>, res: Response): Promise<void> => {
    try {
      await this.service.deletar(req.params.cpf.trim());
      res.status(200).json({ message: 'Cliente removido com sucesso.' });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Erro ao deletar cliente.' });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, senha, nm_email, cd_senha } = req.body;
      const emailLogin = email || nm_email;
      const senhaLogin = senha || cd_senha;

      if (!emailLogin || !senhaLogin) {
        res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
        return;
      }

      const cliente = await this.service.login(emailLogin, senhaLogin);
      if (!cliente) {
        res.status(401).json({ message: 'E-mail ou senha incorretos.' });
        return;
      }
      res.status(200).json(cliente);
    } catch {
      res.status(500).json({ message: 'Erro interno ao tentar logar.' });
    }
  };
}

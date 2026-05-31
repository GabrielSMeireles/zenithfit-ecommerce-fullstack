import { type Request, type Response } from "express";
import { ChatbotService } from '../services/ChatbotService.js';

export class ChatbotController {
  private service = new ChatbotService();

  responder = async (req: Request, res: Response): Promise<void> => {
    try {
      const { historico } = req.body;

      if (!historico || !Array.isArray(historico)) {
        res.status(400).json({ erro: 'Histórico de conversa inválido ou ausente.' });
        return;
      }

      const resposta = await this.service.processar(historico);
      res.status(200).json({ resposta });
    } catch (error) {
      console.error('Erro na rota do chatbot:', error);
      res.status(500).json({ erro: 'Erro interno no servidor do chatbot.' });
    }
  };
}

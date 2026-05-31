import { GoogleGenAI } from '@google/genai';

export class GeminiStrategy {
  private client: GoogleGenAI;

  constructor() {
    this.client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  }

  async processar(promptSistema: string, historico: Array<{ role: string; content: string }>): Promise<string> {
    const mensagensFormatadas = historico.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const resultado = await this.client.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: mensagensFormatadas,
      config: {
        systemInstruction: promptSistema,
        temperature: 0.5,
      },
    });

    return resultado.text ?? '';
  }
}

import OpenAI from 'openai';

export class GrokStrategy {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.GROK_API_KEY,
      baseURL: 'https://api.x.ai/v1',
    });
  }

  async processar(promptSistema: string, historico: Array<{ role: string; content: string }>): Promise<string> {
    const mensagens = [
      { role: 'system' as const, content: promptSistema },
      ...historico.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    ];

    const resposta = await this.client.chat.completions.create({
      model: 'grok-3-fast',
      messages: mensagens,
    });

    return resposta.choices?.[0]?.message?.content ?? 'Sem resposta.';
  }
}

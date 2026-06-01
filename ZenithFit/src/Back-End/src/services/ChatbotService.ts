import { GeminiStrategy } from '../strategies/ia/GeminiStrategy.js';
import { GrokStrategy } from '../strategies/ia/GrokStrategy.js';
import { ProdutoDAO } from '../dao/ProdutoDAO.js';
import { PedidoDAO } from '../dao/PedidoDAO.js';

const PROMPT_BASE = `
Você é o ZenithBot, assistente da ZenithFit, loja de camisas oversized com estampas de animes, games e cultura geek.

REGRAS OBRIGATÓRIAS:
1. Ajude o cliente a escolher camisetas com base no tamanho (P a GG oversized), estampa, cor e ocasião.
2. Use APENAS os produtos listados no final deste prompt para recomendar.
3. Ao recomendar, explique brevemente por que a camisa combina com o pedido.
4. Responda dúvidas sobre frete: retirada na loja é grátis, prazo de 3 a 7 dias úteis.
5. Se o cliente quiser comprar, informe o código do produto.
6. Para dúvidas sobre pedido ou troca, encaminhe para o suporte humano.
7. Você deve considerar a descrição dos produtos para fazer a busca.
8. SE EXISTIREM VÁRIOS produtos que correspondam ao tema, liste e recomende todos (até 3).
9. SEMPRE considere o histórico de compras do cliente para recomendar produtos parecidos.
10. Se o cliente já comprou produtos de determinado anime ou estilo, priorize recomendações semelhantes.
11. SOMENTE recomende camisetas ou roupas quando o usuário pedir explicitamente recomendação de roupa, camiseta, look, estilo, outfit ou vestimenta.
12. Se o usuário pedir qualquer outro tipo de produto que não seja roupa da ZenithFit, informe educadamente que a loja trabalha apenas com camisetas oversized.
13. Se o usuário mencionar situações absurdas, perigosas, ilegais ou sem sentido para uso das camisetas, NÃO faça recomendações.
14. Exemplos de situações absurdas que devem ser recusadas:
- "camiseta para nadar no Tietê"
- "camiseta para cometer crimes"
- "camiseta resistente a tiro"
- "camiseta para invadir lugar"
15. Nesses casos, responda de forma educada dizendo que não é possível recomendar produtos para esse contexto.
16. Você é EXCLUSIVAMENTE um assistente da ZenithFit.
17. Responda APENAS perguntas relacionadas a:
- camisetas
- roupas
- estilos
- estampas
- tamanhos
- recomendações de anime/geek
- pedidos
- frete
- trocas
- produtos da ZenithFit

18. Se o usuário fizer perguntas fora desse contexto, responda educadamente que você só pode ajudar com assuntos relacionados à ZenithFit.

19. NÃO responda:
- contas matemáticas
- perguntas escolares
- programação
- política
- curiosidades gerais
- notícias
- receitas
- medicina
- assuntos aleatórios

20. Exemplo de resposta para perguntas fora do contexto:
"Desculpe, eu posso ajudar apenas com produtos da ZenithFit."

REGRAS DE SEGURANÇA E ÉTICA (ACIMA DE TUDO):
- Se o cliente mencionar suicídio, autoagressão, morte ou violência extrema, recuse IMEDIATAMENTE e indique o CVV 188.
- Exemplo: "Puxa, não posso ajudar com esse tipo de assunto. Se você estiver passando por um momento difícil, sugiro conversar com um profissional ou ligar para o CVV 188."
- Para menções de gangues, vandalismo, assédio ou discriminação: "Sinto muito, mas a ZenithFit repudia qualquer tipo de violência ou discriminação. Não podemos dar continuidade ao atendimento."

Formatação:
- NUNCA use asteriscos (*), traços (-) ou Markdown.
- Cada recomendação em uma linha separada.
- Não inicie com o preço; descreva primeiro.

No FINAL da resposta, acrescente (quando relevante):
[PRODUTOS_START]{"produtos":[{"id":ID,"nome":"NOME","preco":PRECO,"imagem":"IMAGEM"}]}[PRODUTOS_END]

Agora, com base nos produtos listados abaixo, responda ao cliente.
`;

export class ChatbotService {
  private gemini = new GeminiStrategy();
  private grok = new GrokStrategy();
  private produtoDAO = new ProdutoDAO();
  private pedidoDAO = new PedidoDAO();

  async processar(
    historico: Array<{ role: string; content: string }>,
    cpf?: string
  ): Promise<string> {

    const ultimaMensagem = historico[historico.length - 1]?.content || '';

    const produtos = await this.produtoDAO.buscarPorTexto(ultimaMensagem);

    let listaProdutos = '';

    if (produtos.length > 0) {
      produtos.forEach(p => {
        listaProdutos += `
        ID: ${p.cd_produto},
        Nome: ${p.nm_produto},
        Descrição: ${p.ds_produto},
        Preço: R$ ${p.vl_produto},
        Imagem: ${p.nm_imagem_url}

        `;
      });
    } else {
      listaProdutos = 'Nenhum produto encontrado para essa busca.';
    }

    let historicoComprasTexto = 'Cliente sem histórico de compras.';

    try {

      if (cpf) {

        const pedidos = await this.pedidoDAO.listarPorCliente(cpf);

        if (pedidos.length > 0) {

          const produtosComprados: string[] = [];

          pedidos.forEach((pedido: any) => {

            if (pedido.itens?.length) {

              pedido.itens.forEach((item: any) => {

                if (item.produto) {

                  produtosComprados.push(`
                    Produto comprado:
                    Nome: ${item.produto.nm_produto}
                    Descrição: ${item.produto.ds_produto}
                    `);

                }

              });

            }

          });

          if (produtosComprados.length > 0) {

            historicoComprasTexto = `
              HISTÓRICO DE COMPRAS DO CLIENTE:

              ${produtosComprados.join('\n')}
              `;

          }

        }

      }

    } catch (erroHistorico: any) {

      console.error(
        'Erro ao buscar histórico de compras:',
        erroHistorico.message
      );

    }

    const promptCompleto = `
      ${PROMPT_BASE}

      ${historicoComprasTexto}

      ## PRODUTOS EM ESTOQUE (USE APENAS ESSES):
      ${listaProdutos}
      `;

    try {

      return await this.gemini.processar(
        promptCompleto,
        historico
      );

    } catch (erroGemini: any) {

      console.error('Gemini falhou:', erroGemini.message);

      try {

        return await this.grok.processar(
          promptCompleto,
          historico
        );

      } catch (erroGrok: any) {

        console.error('Grok falhou:', erroGrok.message);

        return 'Desculpe, estou com problemas técnicos. Tente novamente mais tarde.';
      }

    }

  }
}
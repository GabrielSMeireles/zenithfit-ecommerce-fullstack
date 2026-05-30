import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const aiStudio = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const grokClient = new OpenAI({
  apiKey: process.env.GROK_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

const PROMPT_BASE = `
Você é o ZenithBot, assistente da ZenithFit, loja de camisas oversized com estampas de animes, games e cultura geek.

REGRAS OBRIGATÓRIAS:
1. Ajude o cliente a escolher camisetas com base no tamanho (P a GG oversized), estampa, cor e ocasião.
2. Use APENAS os produtos listados no final deste prompt para recomendar.
3. Ao recomendar, explique brevemente por que a camisa combina com o pedido.
4. Responda dúvidas sobre frete: retirada na loja é grátis, prazo de 3 a 7 dias úteis.
5. Se o cliente quiser comprar, informe o código do produto.
6. Para dúvidas sobre pedido ou troca, encaminhe para o suporte humano.
7. Você deve considerar a descrição dos produtos para fazer a busca. Se um usuário pergunta se você tem algo relacionado à jujutsu, tudo que tiver "jujutsu" na descrição serve.
8. SE EXISTIREM VÁRIOS produtos que correspondam ao tema ou anime perguntado pelo cliente, você DEVE listar e recomendar todos eles de uma vez (até o limite de 3 produtos). Não guarde opções; se o cliente pediu Jujutsu e você tem 3 camisas de Jujutsu na lista, mostre as 3 de cara.
REGRAS DE SEGURANÇA E ÉTICA (ACIMA DE TUDO):
- Se o cliente fizer perguntas ou comentários que mencionem, sugiram ou envolvam suicídio, autoagressão (como se cortar), morte, violência extrema, ou uso perigoso/indevido de medicamentos e substâncias, você DEVE recusar o atendimento comercial IMEDIATAMENTE.
- Nesses casos de risco, você NÃO PODE recomendar nenhuma camiseta, NÃO PODE listar produtos e NÃO PODE dar continuidade à venda. 
- Sua resposta deve ser ÚNICA e EXCLUSIVAMENTE o texto de acolhimento e redirecionamento para o suporte humano ou serviço de apoio (ex: CVV 188). 
- Exemplo de resposta obrigatória e curta: "Puxa, não posso ajudar com esse tipo de assunto. Se você estiver passando por um momento difícil, sugiro conversar com um profissional ou ligar para o CVV 188."
- Se o cliente mencionar brigas de gangues/vandalismo, assédio/intimidação, discursos de preconceito/discriminação, ou planos de crimes/falsificação, você DEVE recusar o pedido de forma extremamente neutra, séria e corporativa. Não valide o comportamento dele e não tente vender produtos para esses fins.
- Responda estritamente neste formato: "Sinto muito, mas a ZenithFit repudia qualquer tipo de violência, discriminação, comportamento inadequado ou prática ilícita. Não podemos dar continuidade ao atendimento com base nesse contexto. Se desejar consultar nosso catálogo para uso casual e lazer, estou à disposição."
Formatação das respostas:
- NUNCA use asteriscos (*), traços (-) ou qualquer marcação Markdown.
- Cada recomendação em uma linha separada, sem símbolos de lista no início.
- Não inicie a resposta com o preço. Primeiro descreva, depois mencione o valor.
- Não responda coisas que o cliente não perguntou.
- Aja naturalmente

No FINAL da sua resposta, você pode, dependendo do contexto, acrescentar um bloco neste formato:
[PRODUTOS_START]{"produtos":[{"id":ID,"nome":"NOME","preco":PRECO,"imagem":"IMAGEM"}]}[PRODUTOS_END]
Substitua ID, NOME, PRECO, IMAGEM pelos valores corretos.
- Você pode listar até 3 produtos. Exemplo:
[PRODUTOS_START]{"produtos":[{"id":1,"nome":"Camisa oversized Mahoraga","preco":99.99,"imagem":"images/mahoraga.png"}]}[PRODUTOS_END]

Agora, com base nos produtos listados abaixo, responda ao cliente.
`;

async function buscarProdutos(query: string) {
  if (!query) return [];

  try {
    const termos = query.toLowerCase().split(/\s+/);
    const stopwords = ['quero', 'camisa', 'camiseta', 'de', 'para', 'um', 'uma', 'a', 'o', 'e', 'em', 'com', 'me', 'por', 'que', 'seria', 'pra', 'na', 'no', 'da', 'do', 'tem', 'voce', 'voces', 'procurando', 'sobre'];
    const termosFiltrados = termos.filter(t => t.length > 2 && !stopwords.includes(t));

    // Condição inicial: Frase exata digitada
    const condicoes: any[] = [
      { nm_produto: { contains: query, mode: 'insensitive' } },
      { ds_produto: { contains: query, mode: 'insensitive' } }
    ];

    // CORREÇÃO AQUI: Agora varre cada termo individual tanto no Nome quanto na Descrição!
    if (termosFiltrados.length > 0) {
      for (const termo of termosFiltrados) {
        condicoes.push({ nm_produto: { contains: termo, mode: 'insensitive' } });
        condicoes.push({ ds_produto: { contains: termo, mode: 'insensitive' } }); 
      }
    }

    let produtos = await prisma.produto.findMany({
      where: { OR: condicoes },
      take: 4,
      select: {
        cd_produto: true,
        nm_produto: true,
        ds_produto: true,
        vl_produto: true,
        nm_imagem_url: true
      }
    });

    // Fallback flexível
    if (produtos.length === 0 && query.length > 2) {
      const palavrasBusca = query.split(/\s+/).filter(p => p.length > 2 && !stopwords.includes(p));
      if (palavrasBusca.length > 0) {
        produtos = await prisma.produto.findMany({
          where: {
            OR: palavrasBusca.flatMap(palavra => [
              { nm_produto: { contains: palavra, mode: 'insensitive' } },
              { ds_produto: { contains: palavra, mode: 'insensitive' } }
            ])
          },
          take: 4,
          select: {
            cd_produto: true, nm_produto: true, vl_produto: true, nm_imagem_url: true, ds_produto: true,
          }
        });
      }
    }

    // Fallback: mais populares se zerar tudo
    if (produtos.length === 0) {
      produtos = await prisma.produto.findMany({
        take: 3,
        select: {
          cd_produto: true, nm_produto: true, vl_produto: true, nm_imagem_url: true, ds_produto: true,
        }
      });
      console.log("Nenhum produto encontrado. Retornando padrão.");
    } else {
      console.log(`Produtos encontrados: ${produtos.map(p => p.nm_produto).join(', ')}`);
    }

    return produtos;
  } catch (err) {
    console.error("Erro na busca de produtos:", err);
    return [];
  }
}

export async function gerarRespostaChatbot(historicoConversa: any[]) {
  const ultimaMensagem = historicoConversa[historicoConversa.length - 1]?.content || "";

  // Busca os produtos de acordo com o que o cara digitou
  const produtosRelevantes = await buscarProdutos(ultimaMensagem);

  let listaProdutosTexto = "";
  if (produtosRelevantes.length > 0) {
    produtosRelevantes.forEach(p => {
      listaProdutosTexto += `- ID: ${p.cd_produto}, Nome: ${p.nm_produto}, Descrição: ${p.ds_produto}, Preço: R$ ${p.vl_produto}, Imagem: ${p.nm_imagem_url}\n`;
    });
  } else {
    listaProdutosTexto = "Nenhum produto encontrado no banco para essa busca específica.";
  }

  const promptCompleto = `${PROMPT_BASE}\n\n## PRODUTOS EM ESTOQUE NO BANCO (USE APENAS ESSES):\n${listaProdutosTexto}`;

  // 1. Tentativa com Gemini
  try {
    const modeloGemini = "gemini-3.1-flash-lite";
    
    // CORREÇÃO DO CONTEXTO: Mapeia o histórico todo para o formato do SDK novo do Gemini
    const mensagensFormatadas = historicoConversa.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const resultado = await aiStudio.models.generateContent({
      model: modeloGemini,
      contents: mensagensFormatadas,
      config: { 
        systemInstruction: promptCompleto, 
        temperature: 0.5 
      }
    });
    return resultado.text;
  } catch (erroGemini: any) {
    console.error("Gemini falhou:", erroGemini.message);

    // 2. Fallback Grok
    try {
      const mensagensGrok = [
        { role: "system", content: promptCompleto },
        ...historicoConversa
      ];
      const respostaGrok = await grokClient.chat.completions.create({
        model: "grok-4.1-fast",
        messages: mensagensGrok,
      });
      return respostaGrok.choices?.[0]?.message?.content || "Sem resposta.";
    } catch (erroGrok: any) {
      console.error("Grok falhou:", erroGrok.message);
      return "Desculpe, estou com problemas técnicos. Tente novamente mais tarde.";
    }
  }
}
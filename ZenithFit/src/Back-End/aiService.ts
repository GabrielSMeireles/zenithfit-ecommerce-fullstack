import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

// Instância do Prisma (pode ser a mesma usada no backend)
const prisma = new PrismaClient();

const aiStudio = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const grokClient = new OpenAI({
  apiKey: process.env.GROK_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

// Base do prompt (a lista de produtos será inserida dinamicamente)
const PROMPT_BASE = `
Você é o ZenithBot, assistente da ZenithFit, loja de camisas oversized com estampas de animes, games e cultura geek.

REGRAS OBRIGATÓRIAS:
1. Ajude o cliente a escolher camisetas com base no tamanho (P a GG oversized), estampa, cor e ocasião.
2. Use APENAS os produtos listados no final deste prompt para recomendar.
3. Ao recomendar, explique brevemente por que a camisa combina com o pedido.
4. Responda dúvidas sobre frete: retirada na loja é grátis, prazo de 3 a 7 dias úteis.
5. Se o cliente quiser comprar, informe o código do produto.
6. Para dúvidas sobre pedido ou troca, encaminhe para o suporte humano.
7.Você deve considerar a descrição dos produtos para fazer a busca. Se um usuário pergunta se você tem algo relacionado à jujutsu, tudo que tiver "jujutsu" na descrição serve.

REGRAS DE SEGURANÇA E ÉTICA (ACIMA DE TUDO):
- Se o cliente fizer perguntas sobre suicídio, autoagressão, morte, violência extrema, uso indevido de medicamentos, ou qualquer conteúdo que não esteja relacionado a compra de camisetas oversized, moda, animes, games ou cultura geek, você DEVE responder educadamente que não pode ajudar com esse assunto e redirecionar para o suporte humano ou para um serviço de apoio (ex: CVV 188).
- Exemplo de resposta: "Puxa, não posso ajudar com esse tipo de assunto. Se você estiver passando por um momento difícil, sugiro conversar com um profissional ou ligar para o CVV 188."
- NUNCA responda a perguntas absurdas como se fossem normais. Sempre recuse de forma educada e ofereça ajuda com o propósito da loja.

Formatação das respostas:
- NUNCA use asteriscos (*), traços (-) ou qualquer marcação Markdown.
- Cada recomendação em uma linha separada, sem símbolos de lista no início.
- Não inicie a resposta com o preço. Primeiro descreva, depois mencione o valor.
-Não responda coisas que o cliente não perguntou.
-Aja naturalmente

No FINAL da sua resposta, você pode, dependendo do contexto, acrescentar um bloco neste formato:
[PRODUTOS_START]{"produtos":[{"id":ID,"nome":"NOME","preco":PRECO,"imagem":"IMAGEM"}]}[PRODUTOS_END]
Substitua ID, NOME, PRECO, IMAGEM pelos valores corretos.
- Você pode listar até 3 produtos. Exemplo:
[PRODUTOS_START]{"produtos":[{"id":1,"nome":"Camisa oversized Mahoraga","preco":99.99,"imagem":"images/mahoraga.png"}]}[PRODUTOS_END]

Agora, com base nos produtos listados abaixo, responda ao cliente.
`;

// Função para buscar produtos no banco baseado na última mensagem
async function buscarProdutos(query: string) {
  if (!query) return [];

  try {
    // Prepara termos de busca (remove palavras comuns)
    const termos = query.toLowerCase().split(/\s+/);
    const stopwords = ['quero', 'camisa', 'camiseta', 'de', 'para', 'um', 'uma', 'a', 'o', 'e', 'em', 'com', 'me', 'por', 'que', 'seria', 'uma', 'pra', 'na', 'no', 'da', 'do'];
    const termosFiltrados = termos.filter(t => t.length > 2 && !stopwords.includes(t));

    // Monta condições de busca
    const condicoes: any[] = [
      { nm_produto: { contains: query, mode: 'insensitive' } },
      { ds_produto: { contains: query, mode: 'insensitive' } }

    ];

    // Se tiver termos, adiciona busca por cada termo no nome
    if (termosFiltrados.length > 0) {
      for (const termo of termosFiltrados) {
        condicoes.push({ nm_produto: { contains: termo, mode: 'insensitive' } });
        condicoes.push({ nm_produto: { contains: termo, mode: 'insensitive' } });

      }
    }

    // Busca produtos
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

    // Se não achou nada e a query tem mais de 3 letras, tenta busca mais flexível
    if (produtos.length === 0 && query.length > 2) {
      // Busca por qualquer palavra individual
      const palavrasBusca = query.split(/\s+/).filter(p => p.length > 2);
      if (palavrasBusca.length > 0) {
        produtos = await prisma.produto.findMany({
          where: {
            OR: palavrasBusca.flatMap(palavra => [
              { nm_produto: { contains: palavra, mode: 'insensitive' } },
              { ds_produto: { contains: palavra, mode: 'insensitive' } }  // ← ADICIONE ESTA LINHA
            ])
          },
          take: 4,
          select: {
            cd_produto: true, nm_produto: true, vl_produto: true, nm_imagem_url: true, ds_produto: true,
          }
        });
      }
    }

    // Fallback: produtos mais populares
    if (produtos.length === 0) {
      produtos = await prisma.produto.findMany({
        orderBy: { qt_estoque: 'desc' },
        take: 3,
        select: {
          cd_produto: true, nm_produto: true, vl_produto: true, nm_imagem_url: true, ds_produto: true,
        }
      });
      console.log("Nenhum produto encontrado para a busca. Retornando os mais vendidos.");
    } else {
      console.log(`Produtos encontrados: ${produtos.map(p => p.nm_produto).join(', ')}`);
    }

    return produtos;
  } catch (err) {
    console.error("Erro na busca de produtos:", err);
    // Fallback seguro: retorna produtos mais vendidos
    const fallback = await prisma.produto.findMany({ take: 3, orderBy: { qt_estoque: 'desc' }, select: { cd_produto: true, nm_produto: true, vl_produto: true, nm_imagem_url: true } });
    return fallback;
  }
}

export async function gerarRespostaChatbot(historicoConversa: any[]) {
  const ultimaMensagem = historicoConversa[historicoConversa.length - 1]?.content || "";

  // Busca produtos relevantes
  const produtosRelevantes = await buscarProdutos(ultimaMensagem);

  // Monta a lista de produtos para injetar no prompt
  let listaProdutosTexto = "";
  if (produtosRelevantes.length > 0) {
    produtosRelevantes.forEach(p => {
      listaProdutosTexto += `- ID: ${p.cd_produto}, Nome: ${p.nm_produto}, Preço: R$ ${p.vl_produto}, Imagem: ${p.nm_imagem_url}\n`;
    });
  } else {
    listaProdutosTexto = "Nenhum produto encontrado. Peça para o cliente refinar a busca (personagem, cor, estilo).";
  }

  const promptCompleto = `${PROMPT_BASE}\n\n## Produtos disponíveis para recomendar agora:\n${listaProdutosTexto}`;

  // 1. Tentativa com Gemini
  try {
    const modeloGemini = "gemini-3.1-flash-lite";
    const resultado = await aiStudio.models.generateContent({
      model: modeloGemini,
      contents: [{ role: "user", parts: [{ text: ultimaMensagem }] }],
      config: { systemInstruction: promptCompleto, temperature: 0.7 }
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
        model: "grok-4.1-fast", // verifique se esse modelo existe
        messages: mensagensGrok,
      });
      return respostaGrok.choices?.[0]?.message?.content || "Sem resposta do Grok.";
    } catch (erroGrok: any) {
      console.error("Grok falhou:", erroGrok.message);
      return "Desculpe, estou com problemas técnicos. Tente novamente mais tarde.";
    }
  }
}
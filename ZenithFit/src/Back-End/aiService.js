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

Formatação das respostas:
- NUNCA use asteriscos (*), traços (-) ou qualquer marcação Markdown.
- Cada recomendação em uma linha separada, sem símbolos de lista no início.
- Não inicie a resposta com o preço. Primeiro descreva, depois mencione o valor.

No FINAL da sua resposta, você DEVE acrescentar um bloco EXATAMENTE neste formato:
[PRODUTOS_START]{"produtos":[{"id":ID,"nome":"NOME","preco":PRECO,"imagem":"IMAGEM"}]}[PRODUTOS_END]
Substitua ID, NOME, PRECO, IMAGEM pelos valores corretos.
- Você pode listar até 3 produtos. Exemplo:
[PRODUTOS_START]{"produtos":[{"id":1,"nome":"Camisa oversized Mahoraga","preco":99.99,"imagem":"images/mahoraga.png"}]}[PRODUTOS_END]

Agora, com base nos produtos listados abaixo, responda ao cliente.
`;
// Função para buscar produtos no banco baseado na última mensagem
async function buscarProdutos(query) {
    if (!query)
        return [];
    try {
        // Tenta buscar por nome primeiro
        let produtos = await prisma.produto.findMany({
            where: {
                nm_produto: { contains: query, mode: 'insensitive' }
            },
            take: 3,
            select: {
                cd_produto: true,
                nm_produto: true,
                vl_produto: true,
                nm_imagem_url: true
            }
        });
        // Se não achou por nome, tenta buscar por palavras-chave separadas
        if (produtos.length === 0 && query.includes(' ')) {
            const palavras = query.split(' ').filter(p => p.length > 2);
            for (const palavra of palavras) {
                const encontrados = await prisma.produto.findMany({
                    where: { nm_produto: { contains: palavra, mode: 'insensitive' } },
                    take: 3,
                    select: { cd_produto: true, nm_produto: true, vl_produto: true, nm_imagem_url: true }
                });
                if (encontrados.length > 0) {
                    produtos = encontrados;
                    break;
                }
            }
        }
        // Se ainda assim não achou, retorna os 3 produtos mais populares (estoque alto)
        if (produtos.length === 0) {
            produtos = await prisma.produto.findMany({
                orderBy: { qt_estoque: 'desc' },
                take: 3,
                select: { cd_produto: true, nm_produto: true, vl_produto: true, nm_imagem_url: true }
            });
            console.log("Nenhum produto específico encontrado. Retornando os mais vendidos.");
        }
        else {
            console.log(`Encontrados: ${produtos.map(p => p.nm_produto).join(', ')}`);
        }
        return produtos;
    }
    catch (err) {
        console.error("Erro ao buscar produtos:", err);
        return [];
    }
}
export async function gerarRespostaChatbot(historicoConversa) {
    const ultimaMensagem = historicoConversa[historicoConversa.length - 1]?.content || "";
    // Busca produtos relevantes
    const produtosRelevantes = await buscarProdutos(ultimaMensagem);
    // Monta a lista de produtos para injetar no prompt
    let listaProdutosTexto = "";
    if (produtosRelevantes.length > 0) {
        produtosRelevantes.forEach(p => {
            listaProdutosTexto += `- ID: ${p.cd_produto}, Nome: ${p.nm_produto}, Preço: R$ ${p.vl_produto}, Imagem: ${p.nm_imagem_url}\n`;
        });
    }
    else {
        listaProdutosTexto = "Nenhum produto encontrado. Peça para o cliente refinar a busca (personagem, cor, estilo).";
    }
    const promptCompleto = `${PROMPT_BASE}\n\n## Produtos disponíveis para recomendar agora:\n${listaProdutosTexto}`;
    // 1. Tentativa com Gemini
    try {
        const modeloGemini = "gemini-2.5-flash"; // ou "gemini-1.5-flash"
        const resultado = await aiStudio.models.generateContent({
            model: modeloGemini,
            contents: [{ role: "user", parts: [{ text: ultimaMensagem }] }],
            config: { systemInstruction: promptCompleto, temperature: 0.7 }
        });
        return resultado.text;
    }
    catch (erroGemini) {
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
        }
        catch (erroGrok) {
            console.error("Grok falhou:", erroGrok.message);
            return "Desculpe, estou com problemas técnicos. Tente novamente mais tarde.";
        }
    }
}
//# sourceMappingURL=aiService.js.map
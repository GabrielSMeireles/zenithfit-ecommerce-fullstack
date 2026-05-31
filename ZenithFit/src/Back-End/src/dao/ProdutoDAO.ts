import { prisma } from '../db.js';
import type { IDAO } from '../interfaces/IDAO.js';
import { Produto } from '../entities/Produto.js';

export class ProdutoDAO implements IDAO<Produto> {

  async salvar(produto: Produto): Promise<Produto> {
    const result = await prisma.produto.create({ data: produto });
    return Object.assign(new Produto(), result);
  }

  async alterar(produto: Produto): Promise<Produto> {
    const result = await prisma.produto.update({
      where: { cd_produto: produto.cd_produto },
      data: produto,
    });
    return Object.assign(new Produto(), result);
  }

  async consultar(id: number): Promise<Produto | null> {
    const result = await prisma.produto.findUnique({ where: { cd_produto: id } });
    if (!result) return null;
    return Object.assign(new Produto(), result);
  }

  async listarTodos(): Promise<Produto[]> {
    const result = await prisma.produto.findMany();
    return result.map(r => Object.assign(new Produto(), r));
  }

  async deletar(id: number): Promise<void> {
    await prisma.produto.delete({ where: { cd_produto: id } });
  }

  async buscarPorTexto(query: string): Promise<Produto[]> {
    if (!query) return [];

    try {
      const stopwords = [
        'quero', 'camisa', 'camiseta',
        'de', 'para', 'um', 'uma',
        'a', 'o', 'e', 'em', 'com',
        'me', 'por', 'que', 'seria',
        'pra', 'na', 'no', 'da',
        'do', 'tem', 'voce', 'voces',
        'procurando', 'sobre'
      ];

      const termos = query
        .toLowerCase()
        .split(/\s+/)
        .filter(t => t.length > 2 && !stopwords.includes(t));

      const condicoes: any[] = [
        { nm_produto: { contains: query, mode: 'insensitive' } },
        { ds_produto: { contains: query, mode: 'insensitive' } },
      ];

      for (const termo of termos) {
        condicoes.push({
          nm_produto: {
            contains: termo,
            mode: 'insensitive'
          }
        });

        condicoes.push({
          ds_produto: {
            contains: termo,
            mode: 'insensitive'
          }
        });
      }

      let result = await prisma.produto.findMany({
        where: { OR: condicoes },
        take: 4,
        select: {
          cd_produto: true,
          nm_produto: true,
          ds_produto: true,
          vl_produto: true,
          nm_imagem_url: true,
        }
      });

      if (result.length === 0 && termos.length > 0) {
        result = await prisma.produto.findMany({
          where: {
            OR: termos.flatMap(t => [
              {
                nm_produto: {
                  contains: t,
                  mode: 'insensitive'
                }
              },
              {
                ds_produto: {
                  contains: t,
                  mode: 'insensitive'
                }
              }
            ])
          },
          take: 4,
          select: {
            cd_produto: true,
            nm_produto: true,
            ds_produto: true,
            vl_produto: true,
            nm_imagem_url: true,
          }
        });
      }

      if (result.length === 0) {
        result = await prisma.produto.findMany({
          take: 3,
          select: {
            cd_produto: true,
            nm_produto: true,
            ds_produto: true,
            vl_produto: true,
            nm_imagem_url: true,
          }
        });

        console.log('Fallback produtos padrão');
      } else {
        console.log(
          'Produtos encontrados:',
          result.map(p => p.nm_produto).join(', ')
        );
      }

      return result.map(r =>
        Object.assign(new Produto(), r)
      );

    } catch (err) {
      console.error(
        'Erro na busca de produtos:',
        err
      );

      return [];
    }
  }
}
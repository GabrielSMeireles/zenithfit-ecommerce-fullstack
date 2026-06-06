import { type Request, type Response } from 'express';
import { prisma } from '../db.js';

export class AnaliseController {
  async obterDadosGrafico(req: Request, res: Response): Promise<void> {
    try {
      const { dataInicio, dataFim, categorias } = req.query;

      if (!dataInicio || !dataFim) {
        res.status(400).json({ message: 'As datas de início e fim são obrigatórias.' });
        return;
      }

      // Filtro base de período
      const ondeFiltro: any = {
        dt_pedido: {
          gte: new Date(dataInicio as string),
          lte: new Date(dataFim as string),
        },
      };

      // Se o usuário selecionou categorias específicas na requisição
      if (categorias) {
        const categoriasIds = (categorias as string).split(',').map(Number);
        ondeFiltro.itens = {
          some: {
            produto: {
              cd_categoria: { in: categoriasIds },
            },
          },
        };
      }

      // Busca todos os pedidos correspondentes trazendo os itens e categorias
      const pedidos = await prisma.pedido.findMany({
        where: ondeFiltro,
        include: {
          itens: {
            include: {
              produto: {
                include: { categoria: true },
              },
            },
          },
        },
        orderBy: { dt_pedido: 'asc' },
      });

      // Estrutura de dados para o agrupamento: { "2025-01-01": { "Categoria A": 10, "Categoria B": 5 } }
      const agrupado: Record<string, Record<string, number>> = {};

      pedidos.forEach((pedido) => {
        const dataStr = pedido.dt_pedido.toISOString().split('T')[0]; // Formato YYYY-MM-DD

        if (!agrupado[dataStr]) {
          agrupado[dataStr] = {};
        }

        pedido.itens.forEach((item) => {
          const nomeCategoria = item.produto.categoria.nm_categoria;
          const qtd = item.qt_item;

          // Se categorias foi filtrado e esta não faz parte, pula (garantia)
          if (categorias) {
            const categoriasIds = (categorias as string).split(',').map(Number);
            if (!categoriasIds.includes(item.produto.cd_categoria)) return;
          }

          agrupado[dataStr][nomeCategoria] = (agrupado[dataStr][nomeCategoria] || 0) + qtd;
        });
      });

      res.status(200).json(agrupado);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao processar dados de análise.' });
    }
  }

  async listarCategorias(req: Request, res: Response): Promise<void> {
    try {
      const categorias = await prisma.categoria.findMany({ orderBy: { nm_categoria: 'asc' } });
      res.status(200).json(categorias);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar categorias.' });
    }
  }
}
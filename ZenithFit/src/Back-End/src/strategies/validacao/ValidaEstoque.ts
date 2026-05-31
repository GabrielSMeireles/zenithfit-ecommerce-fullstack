import { prisma } from '../../db.js';
import type { IStrategy } from '../../interfaces/IStrategy.js';
import { Pedido } from '../../entities/Pedido.js';

export class ValidaEstoque implements IStrategy<Pedido> {
  async validar(pedido: Pedido): Promise<void> {
    if (!pedido.itens || pedido.itens.length === 0) {
      throw new Error('O pedido deve conter ao menos um item.');
    }

    for (const item of pedido.itens) {
      const produto = await prisma.produto.findUnique({
        where: { cd_produto: item.cd_produto },
        select: { nm_produto: true, qt_estoque: true },
      });

      if (!produto) {
        throw new Error(`Produto ID ${item.cd_produto} não encontrado.`);
      }

      if (produto.qt_estoque < item.qt_item) {
        throw new Error(
          `Estoque insuficiente para "${produto.nm_produto}": disponível ${produto.qt_estoque}, solicitado ${item.qt_item}.`
        );
      }
    }
  }
}

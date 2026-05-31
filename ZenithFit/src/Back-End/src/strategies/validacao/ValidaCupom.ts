import { prisma } from '../../db.js';
import type { IStrategy } from '../../interfaces/IStrategy.js';
import { Pedido } from '../../entities/Pedido.js';

export class ValidaCupom implements IStrategy<Pedido> {
  async validar(pedido: Pedido): Promise<void> {
    if (!pedido.cupons || pedido.cupons.length === 0) return; // cupom é opcional

    for (const codigo of pedido.cupons) {
      const cupom = await prisma.cupom.findUnique({ where: { nm_codigo: codigo } });

      if (!cupom) {
        throw new Error(`Cupom "${codigo}" não encontrado.`);
      }

      if (!cupom.fl_ativo) {
        throw new Error(`Cupom "${codigo}" está inativo ou já foi utilizado.`);
      }
    }
  }
}

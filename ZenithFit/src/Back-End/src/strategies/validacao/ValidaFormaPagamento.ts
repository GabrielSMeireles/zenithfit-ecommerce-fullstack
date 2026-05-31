import type { IStrategy } from '../../interfaces/IStrategy.js';
import { Pedido } from '../../entities/Pedido.js';

export class ValidaFormaPagamento implements IStrategy<Pedido> {
  async validar(pedido: Pedido): Promise<void> {
    if (!pedido.pagamentos || pedido.pagamentos.length === 0) {
      throw new Error('É necessário informar ao menos uma forma de pagamento.');
    }

    const totalPago = pedido.pagamentos.reduce((acc, p) => acc + Number(p.vl_pago), 0);

    if (totalPago <= 0) {
      throw new Error('O valor pago deve ser maior que zero.');
    }

    // Tolerância de R$0,01 para arredondamento de centavos
    if (Math.abs(totalPago - Number(pedido.vl_total)) > 0.01) {
      throw new Error(
        `Soma dos pagamentos (R$ ${totalPago.toFixed(2)}) difere do total do pedido (R$ ${Number(pedido.vl_total).toFixed(2)}).`
      );
    }
  }
}

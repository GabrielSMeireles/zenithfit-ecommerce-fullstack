import { EntidadeDominio } from './EntidadeDominio.js';

export class Pedido extends EntidadeDominio {
  cd_pedido?: number;
  dt_pedido?: Date;
  vl_total!: number;
  vl_frete!: number;
  cd_cpf!: string;
  cd_endereco!: number;
  cd_modalidade!: number;
  cd_status_pedido?: number;
  itens!: ItemPedidoInput[];
  pagamentos!: PagamentoInput[];
  cupons?: string[];
}

export interface ItemPedidoInput {
  cd_produto: number;
  qt_item: number;
  vl_unitario: number;
  nm_tamanho?: string;
}

export interface PagamentoInput {
  cd_cartao?: number;
  vl_pago: number;
}

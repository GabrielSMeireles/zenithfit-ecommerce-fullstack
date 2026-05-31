import { prisma } from '../db.js';
import type { IDAO } from '../interfaces/IDAO.js';
import { Pedido } from '../entities/Pedido.js';

export class PedidoDAO implements IDAO<Pedido> {

  async salvar(pedido: Pedido): Promise<Pedido> {
    const result = await prisma.pedido.create({
      data: {
        cd_cpf: pedido.cd_cpf,
        cd_endereco: pedido.cd_endereco,
        cd_modalidade: pedido.cd_modalidade,
        vl_total: pedido.vl_total,
        vl_frete: pedido.vl_frete,
        cd_status_pedido: pedido.cd_status_pedido ?? 1,
        itens: {
          create: pedido.itens.map(i => ({
            cd_produto: i.cd_produto,
            qt_item: i.qt_item,
            vl_unitario: i.vl_unitario,
            nm_tamanho: i.nm_tamanho,
          })),
        },
        pagamentos: {
          create: pedido.pagamentos.map(p => ({
            cd_cartao: p.cd_cartao,
            vl_pago: p.vl_pago,
          })),
        },
      },
    });
    return Object.assign(new Pedido(), result);
  }

  async alterar(pedido: Pedido): Promise<Pedido> {
    const result = await prisma.pedido.update({
      where: { cd_pedido: pedido.cd_pedido },
      data: { cd_status_pedido: pedido.cd_status_pedido },
    });
    return Object.assign(new Pedido(), result);
  }

  async consultar(id: number): Promise<Pedido | null> {
    const result = await prisma.pedido.findUnique({
      where: { cd_pedido: id },
      include: {
        cliente: { select: { nm_nome_cliente: true, cd_cpf: true } },
        itens: { include: { produto: true } },
        pagamentos: { include: { cartao: { include: { bandeira: true } } } },
        cupons_usados: { include: { cupom: true } },
        modalidade: true,
        status_pedido: true,
        endereco_entrega: true,
      },
    });
    if (!result) return null;
    return Object.assign(new Pedido(), result);
  }

  async listarTodos(): Promise<Pedido[]> {
    const result = await prisma.pedido.findMany({
      include: {
        cliente: { select: { nm_nome_cliente: true, cd_cpf: true } },
        itens: { include: { produto: true } },
        pagamentos: { include: { cartao: { include: { bandeira: true } } } },
        cupons_usados: { include: { cupom: true } },
        modalidade: true,
        status_pedido: true,
        endereco_entrega: true,
      },
      orderBy: { dt_pedido: 'desc' },
    });
    return result.map(r => Object.assign(new Pedido(), r));
  }

  async listarPorCliente(cpf: string): Promise<Pedido[]> {
    const result = await prisma.pedido.findMany({
      where: { cd_cpf: cpf },
      include: {
        itens: { include: { produto: true } },
        pagamentos: { include: { cartao: { include: { bandeira: true } } } },
        cupons_usados: { include: { cupom: true } },
        modalidade: true,
        status_pedido: true,
        endereco_entrega: true,
      },
      orderBy: { dt_pedido: 'desc' },
    });
    return result.map(r => Object.assign(new Pedido(), r));
  }

  async deletar(id: number): Promise<void> {
    await prisma.pedido.delete({ where: { cd_pedido: id } });
  }
}

import { prisma } from '../db.js';
import type { IDAO } from '../interfaces/IDAO.js';
import { Troca } from '../entities/Troca.js';

export class TrocaDAO implements IDAO<Troca> {

  async salvar(troca: Troca): Promise<Troca> {
    const result = await prisma.troca.create({
      data: {
        cd_pedido: troca.cd_pedido,
        cd_item: troca.cd_item ?? null,
        ds_motivo: troca.ds_motivo,
        ds_descricao: troca.ds_descricao ?? null,
        cd_status_troca: troca.cd_status_troca ?? 1,
      },
    });
    return Object.assign(new Troca(), result);
  }

  async alterar(troca: Troca): Promise<Troca> {
    const result = await prisma.troca.update({
      where: { cd_troca: troca.cd_troca },
      data: {
        cd_status_troca: troca.cd_status_troca,
        cd_cupom: troca.cd_cupom ?? undefined,
      },
    });
    return Object.assign(new Troca(), result);
  }

  async consultar(id: number): Promise<Troca | null> {
    const result = await prisma.troca.findUnique({
      where: { cd_troca: id },
      include: {
        pedido: {
          select: {
            cd_pedido: true, dt_pedido: true, vl_total: true,
            cliente: { select: { nm_nome_cliente: true, cd_cpf: true } },
          },
        },
        item: { include: { produto: { select: { nm_produto: true, nm_imagem_url: true } } } },
        status_troca: true,
        cupom: true,
      },
    });
    if (!result) return null;
    return Object.assign(new Troca(), result);
  }

  async listarTodas(): Promise<any[]> {
    return prisma.troca.findMany({
      include: {
        pedido: {
          select: {
            cd_pedido: true, dt_pedido: true,
            cliente: { select: { nm_nome_cliente: true } },
          },
        },
        item: { include: { produto: { select: { nm_produto: true, nm_imagem_url: true } } } },
        status_troca: true,
      },
      orderBy: { dt_solicitacao: 'desc' },
    });
  }

  async deletar(id: number): Promise<void> {
    await prisma.troca.delete({ where: { cd_troca: id } });
  }
}

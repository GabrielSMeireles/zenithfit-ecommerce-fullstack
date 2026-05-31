import type { IFachada } from '../interfaces/IFachada.js';
import { Troca } from '../entities/Troca.js';
import { TrocaDAO } from '../dao/TrocaDAO.js';
import { GeraMensagem } from '../notification/GeraMensagem.js';
import { prisma } from '../db.js';

export class TrocaService implements IFachada<Troca> {
  private dao = new TrocaDAO();
  private notificacao = new GeraMensagem();

  async salvar(dados: any): Promise<Troca> {
    if (!dados.cd_pedido || !dados.motivo) {
      throw new Error('Pedido e motivo são obrigatórios para abertura de troca.');
    }

    const troca = Object.assign(new Troca(), {
      cd_pedido: Number(dados.cd_pedido),
      cd_item: dados.cd_item ? Number(dados.cd_item) : undefined,
      ds_motivo: dados.motivo,
      ds_descricao: dados.descricao ?? null,
      cd_status_troca: 1,
    });

    const resultado = await this.dao.salvar(troca);
    this.notificacao.log('TROCA', `Troca #${resultado.cd_troca} aberta para pedido #${troca.cd_pedido}`);
    return resultado;
  }

  async alterar(troca: Troca): Promise<Troca> {
    return this.dao.alterar(troca);
  }

  async atualizarStatus(id: number, novoStatus: number): Promise<any> {
    const troca = await prisma.troca.update({
      where: { cd_troca: id },
      data: { cd_status_troca: novoStatus },
      include: {
        item: { include: { produto: true } },
        pedido: { select: { cd_pedido: true, vl_total: true } },
      },
    });

    if (novoStatus === 2 && !troca.cd_cupom) {
      const valorCupom = troca.item?.vl_unitario ?? troca.pedido?.vl_total ?? 0;
      const codigo = `TROCA-${troca.cd_troca}-${Date.now()}`;

      const novoCupom = await prisma.cupom.create({
        data: {
          nm_codigo: codigo,
          vl_desconto: valorCupom,
          tp_cupom: 'TROCA',
          fl_ativo: true,
        },
      });

      await prisma.troca.update({
        where: { cd_troca: troca.cd_troca },
        data: { cd_cupom: novoCupom.cd_cupom },
      });

      this.notificacao.log('TROCA', `Cupom ${codigo} gerado para troca #${id} — Valor: R$ ${Number(valorCupom).toFixed(2)}`);
    }

    return troca;
  }

  async consultar(id: number): Promise<any | null> {
    const t = await this.dao.consultar(id);

    if (!t) return null;

    return {
      cd_troca: t.cd_troca,
      dt_solicitacao: t.dt_solicitacao,

      motivo: t.ds_motivo,
      descricao: t.ds_descricao,

      status: (t as any).status_troca?.nm_status,

      pedido: {
        numero: (t as any).pedido?.cd_pedido,
        data: (t as any).pedido?.dt_pedido,
        valor: (t as any).pedido?.vl_total,
        cliente: (t as any).pedido?.cliente?.nm_nome_cliente,
      },

      item: (t as any).item
        ? {
            nome: (t as any).item?.produto?.nm_produto,
            imagem: (t as any).item?.produto?.nm_imagem_url,
            tamanho: (t as any).item?.nm_tamanho,
            valor_unitario: (t as any).item?.vl_unitario,
          }
        : null,

      cupom: (t as any).cupom
        ? {
            codigo: (t as any).cupom?.nm_codigo,
            valor: (t as any).cupom?.vl_desconto,
          }
        : null,
    };
  }

  async listarTodas(): Promise<any[]> {
    const trocas = await this.dao.listarTodas();
    return trocas.map((t: any) => ({
      cd_troca: t.cd_troca,
      dt_solicitacao: t.dt_solicitacao,
      motivo: t.ds_motivo,
      descricao: t.ds_descricao,
      status: t.status_troca.nm_status,
      pedido: {
        numero: t.pedido.cd_pedido,
        cliente: t.pedido.cliente?.nm_nome_cliente,
      },
      item: t.item ? {
        nome: t.item.produto?.nm_produto,
        imagem: t.item.produto?.nm_imagem_url,
        tamanho: t.item.nm_tamanho,
      } : null,
    }));
  }

  async deletar(id: number): Promise<void> {
    await this.dao.deletar(id);
  }
}

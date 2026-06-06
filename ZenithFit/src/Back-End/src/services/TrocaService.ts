import { Fachada } from './Fachada.js';
import { Troca } from '../entities/Troca.js';
import { TrocaDAO } from '../dao/TrocaDAO.js';
import { GeraMensagem } from '../notification/GeraMensagem.js';
import { prisma } from '../db.js';

export class TrocaService extends Fachada<Troca> {
  private notificacao = new GeraMensagem();

  constructor() {
    super(new TrocaDAO());
  }

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

  async listarTodas(): Promise<any[]> {
    const trocas = await (this.dao as TrocaDAO).listarTodas();
    return trocas.map((t: any) => ({
      cd_troca: t.cd_troca,
      dt_solicitacao: t.dt_solicitacao,
      motivo: t.ds_motivo,
      descricao: t.ds_descricao,
      status: t.status_troca.nm_status,
      pedido: { numero: t.pedido.cd_pedido, cliente: t.pedido.cliente?.nm_nome_cliente },
      item: t.item ? { nome: t.item.produto?.nm_produto, imagem: t.item.produto?.nm_imagem_url, tamanho: t.item.nm_tamanho } : null,
    }));
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

    if (novoStatus === 4 && !troca.cd_cupom) {
      const valorCupom = troca.item?.vl_unitario ?? troca.pedido?.vl_total ?? 0;
      const codigo = `TROCA-${troca.cd_troca}-${Date.now()}`;
      const novoCupom = await prisma.cupom.create({
        data: { nm_codigo: codigo, vl_desconto: valorCupom, tp_cupom: 'TROCA', fl_ativo: true },
      });
      await prisma.troca.update({ where: { cd_troca: troca.cd_troca }, data: { cd_cupom: novoCupom.cd_cupom } });
      this.notificacao.log('TROCA', `Cupom ${codigo} gerado para troca #${id}`);
    }

    return troca;
  }

  async buscar(id: number): Promise<any> {
    const t = await prisma.troca.findUnique({
      where: { cd_troca: id },
      include: {
        status_troca: true,
        pedido: {
          include: {
            cliente: true
          }
        },
        item: {
          include: {
            produto: true
          }
        },
        cupom: true
      }
    });

    if (!t) return null;

    return {
      cd_troca: t.cd_troca,
      motivo: t.ds_motivo,
      descricao: t.ds_descricao,

      status: t.status_troca?.nm_status,

      pedido: {
        numero: t.pedido?.cd_pedido,
        cliente: t.pedido?.cliente?.nm_nome_cliente,
        data: t.pedido?.dt_pedido,
        valor: t.pedido?.vl_total
      },

      item: t.item ? {
        nome: t.item.produto?.nm_produto,
        imagem: t.item.produto?.nm_imagem_url,
        tamanho: t.item.nm_tamanho,
        valor_unitario: t.item.vl_unitario
      } : null,

      cupom: t.cupom ? {
        codigo: t.cupom.nm_codigo,
        valor: t.cupom.vl_desconto
      } : null
    };
  }
}

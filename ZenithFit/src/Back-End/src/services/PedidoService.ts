import type { IFachada } from '../interfaces/IFachada.js';
import { Pedido } from '../entities/Pedido.js';
import { PedidoDAO } from '../dao/PedidoDAO.js';
import { ValidaEstoque } from '../strategies/validacao/ValidaEstoque.js';
import { ValidaCupom } from '../strategies/validacao/ValidaCupom.js';
import { ValidaFormaPagamento } from '../strategies/validacao/ValidaFormaPagamento.js';
import { GeraMensagem } from '../notification/GeraMensagem.js';
import { prisma } from '../db.js';

export class PedidoService implements IFachada<Pedido> {
  private dao = new PedidoDAO();
  private validaEstoque = new ValidaEstoque();
  private validaCupom = new ValidaCupom();
  private validaPagamento = new ValidaFormaPagamento();
  private notificacao = new GeraMensagem();

  async salvar(dados: any): Promise<Pedido> {
    const modalidade = await prisma.modalidade_Frete.findUnique({
      where: { cd_modalidade: Number(dados.cd_modalidade) },
    });
    if (!modalidade) throw new Error('Modalidade de frete inválida.');

    const vl_frete = Number(modalidade.vl_fixo);
    const vl_total_itens = dados.itens.reduce(
      (acc: number, i: any) => acc + Number(i.vl_unitario) * i.qt_item, 0
    );

    let total_desconto = 0;
    const cuponsParaVincular: any[] = [];

    if (dados.cupons?.length) {
      for (const codigo of dados.cupons) {
        const cupomDb = await prisma.cupom.findUnique({ where: { nm_codigo: codigo } });
        if (cupomDb?.fl_ativo) {
          total_desconto += Number(cupomDb.vl_desconto);
          cuponsParaVincular.push(cupomDb);
        }
      }
    }

    const vl_total = (vl_total_itens + vl_frete) - total_desconto;

    const pedido = Object.assign(new Pedido(), {
      ...dados,
      cd_cpf: dados.cpf,
      vl_frete,
      vl_total,
      cd_status_pedido: 1,
    });

    await this.validaEstoque.validar(pedido);
    await this.validaCupom.validar(pedido);
    await this.validaPagamento.validar(pedido);

    const resultado = await prisma.$transaction(async (tx) => {
      const novoPedido = await tx.pedido.create({
        data: {
          cd_cpf: pedido.cd_cpf,
          cd_endereco: pedido.cd_endereco,
          cd_modalidade: pedido.cd_modalidade,
          vl_total: pedido.vl_total,
          vl_frete: pedido.vl_frete,
          cd_status_pedido: 1,
          itens: {
            create: pedido.itens.map((i: any) => ({
              cd_produto: i.cd_produto,
              qt_item: i.qt_item,
              vl_unitario: i.vl_unitario,
              nm_tamanho: i.nm_tamanho,
            })),
          },
          pagamentos: {
            create: pedido.pagamentos.map((p: any) => ({
              cd_cartao: p.cd_cartao,
              vl_pago: p.vl_pago,
            })),
          },
        },
      });

      for (const cupom of cuponsParaVincular) {
        await tx.cupom_Pedido.create({
          data: { cd_pedido: novoPedido.cd_pedido, cd_cupom: cupom.cd_cupom },
        });
        if (cupom.tp_cupom === 'TROCA') {
          await tx.cupom.update({
            where: { cd_cupom: cupom.cd_cupom },
            data: { fl_ativo: false },
          });
        }
      }

      return novoPedido;
    });

    this.notificacao.log('PEDIDO', `Pedido #${resultado.cd_pedido} criado para CPF ${pedido.cd_cpf} — Total: R$ ${vl_total.toFixed(2)}`);
    return Object.assign(new Pedido(), resultado);
  }

  async alterar(pedido: Pedido): Promise<Pedido> {
    return this.dao.alterar(pedido);
  }

  async consultar(id: number): Promise<Pedido | null> {
    return this.dao.consultar(id);
  }

  async listarTodos(): Promise<Pedido[]> {
    return this.dao.listarTodos();
  }

  async listarPorCliente(cpf: string): Promise<Pedido[]> {
    return this.dao.listarPorCliente(cpf);
  }

  async atualizarStatus(id: number, status: number): Promise<Pedido> {
    const pedido = Object.assign(new Pedido(), { cd_pedido: id, cd_status_pedido: status });
    return this.dao.alterar(pedido);
  }

  async deletar(id: number): Promise<void> {
    await this.dao.deletar(id);
  }
}

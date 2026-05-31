import { prisma } from '../db.js';
import type { IDAO } from '../interfaces/IDAO.js';
import { Cartao } from '../entities/Cartao.js';

export class CartaoDAO implements IDAO<Cartao> {

  async salvar(cartao: Cartao): Promise<Cartao> {
    const result = await prisma.cartao_credito.create({
      data: {
        cd_cpf: cartao.cd_cpf,
        cd_numero_cartao: cartao.cd_numero_cartao,
        nm_nome_impresso_cartao: cartao.nm_nome_impresso_cartao,
        cd_seguranca: cartao.cd_seguranca,
        dt_validade_cartao: cartao.dt_validade_cartao,
        cd_bandeira: cartao.cd_bandeira,
        cartao_preferencial: cartao.cartao_preferencial ?? false,
      },
    });
    return Object.assign(new Cartao(), result);
  }

  async alterar(cartao: Cartao): Promise<Cartao> {
    const result = await prisma.cartao_credito.update({
      where: { cd_cartao: cartao.cd_cartao },
      data: cartao,
    });
    return Object.assign(new Cartao(), result);
  }

  async consultar(id: number): Promise<Cartao | null> {
    const result = await prisma.cartao_credito.findUnique({
      where: { cd_cartao: id },
      include: { bandeira: true },
    });
    if (!result) return null;
    return Object.assign(new Cartao(), result);
  }

  async deletar(id: number): Promise<void> {
    await prisma.cartao_credito.delete({ where: { cd_cartao: id } });
  }
}

import { prisma } from '../db.js';
import type { IDAO } from '../interfaces/IDAO.js';
import { Cupom } from '../entities/Cupom.js';

export class CupomDAO implements IDAO<Cupom> {

  async salvar(cupom: Cupom): Promise<Cupom> {
    const result = await prisma.cupom.create({
      data: {
        nm_codigo: cupom.nm_codigo,
        vl_desconto: cupom.vl_desconto,
        tp_cupom: cupom.tp_cupom,
        fl_ativo: cupom.fl_ativo,
      },
    });
    return Object.assign(new Cupom(), result);
  }

  async alterar(cupom: Cupom): Promise<Cupom> {
    const result = await prisma.cupom.update({
      where: { cd_cupom: cupom.cd_cupom },
      data: { fl_ativo: cupom.fl_ativo },
    });
    return Object.assign(new Cupom(), result);
  }

  async consultar(id: number): Promise<Cupom | null> {
    const result = await prisma.cupom.findUnique({ where: { cd_cupom: id } });
    if (!result) return null;
    return Object.assign(new Cupom(), result);
  }

  async consultarPorCodigo(codigo: string): Promise<Cupom | null> {
    const result = await prisma.cupom.findUnique({ where: { nm_codigo: codigo } });
    if (!result) return null;
    return Object.assign(new Cupom(), result);
  }

  async deletar(id: number): Promise<void> {
    await prisma.cupom.delete({ where: { cd_cupom: id } });
  }
}

import type { IFachada } from '../interfaces/IFachada.js';
import { Cupom } from '../entities/Cupom.js';
import { CupomDAO } from '../dao/CupomDAO.js';

export class CupomService implements IFachada<Cupom> {
  private dao = new CupomDAO();

  async salvar(cupom: Cupom): Promise<Cupom> {
    return this.dao.salvar(cupom);
  }

  async alterar(cupom: Cupom): Promise<Cupom> {
    return this.dao.alterar(cupom);
  }

  async consultar(id: number): Promise<Cupom | null> {
    return this.dao.consultar(id);
  }

  async consultarPorCodigo(codigo: string): Promise<Cupom | null> {
    const cupom = await this.dao.consultarPorCodigo(codigo);
    if (!cupom || !(cupom as any).fl_ativo) return null;
    return cupom;
  }

  async deletar(id: number): Promise<void> {
    await this.dao.deletar(id);
  }
}

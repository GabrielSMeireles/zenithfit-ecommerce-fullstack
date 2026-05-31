import { Fachada } from './Fachada.js';
import { Cupom } from '../entities/Cupom.js';
import { CupomDAO } from '../dao/CupomDAO.js';

export class CupomService extends Fachada<Cupom> {
  constructor() {
    super(new CupomDAO());
  }

  async consultarPorCodigo(codigo: string): Promise<Cupom | null> {
    const cupom = await (this.dao as CupomDAO).consultarPorCodigo(codigo);
    if (!cupom || !(cupom as any).fl_ativo) return null;
    return cupom;
  }
}

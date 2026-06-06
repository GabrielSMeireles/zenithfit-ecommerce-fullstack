import { EntidadeDominio } from '../entities/EntidadeDominio.js';
import type { IFachada } from '../interfaces/IFachada.js';
import type { IDAO } from '../interfaces/IDAO.js';

export abstract class Fachada<T extends EntidadeDominio> implements IFachada<T> {
  constructor(protected dao: IDAO<T>) {}

  salvar(entidade: T): Promise<T> {
    return this.dao.salvar(entidade);
  }

  alterar(entidade: T): Promise<T> {
    return this.dao.alterar(entidade);
  }

  consultar(id: string | number): Promise<T | null> {
    return this.dao.consultar(id);
  }

  deletar(id: string | number): Promise<void> {
    return this.dao.deletar(id);
  }
}

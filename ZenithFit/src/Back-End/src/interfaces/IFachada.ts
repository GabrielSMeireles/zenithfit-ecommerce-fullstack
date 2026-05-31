import { EntidadeDominio } from '../entities/EntidadeDominio.js';

export interface IFachada<T extends EntidadeDominio> {
  salvar(entidade: T): Promise<T>;
  alterar(entidade: T): Promise<T>;
  consultar(id: string | number): Promise<T | null>;
  deletar(id: string | number): Promise<void>;
}

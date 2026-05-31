import { EntidadeDominio } from '../entities/EntidadeDominio.js';

export interface IStrategy<T extends EntidadeDominio> {
  validar(entidade: T): Promise<void>;
}

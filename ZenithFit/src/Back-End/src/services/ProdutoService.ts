import { Fachada } from './Fachada.js';
import { Produto } from '../entities/Produto.js';
import { ProdutoDAO } from '../dao/ProdutoDAO.js';

export class ProdutoService extends Fachada<Produto> {
  constructor() {
    super(new ProdutoDAO());
  }

  async listarTodos(): Promise<Produto[]> {
    return (this.dao as ProdutoDAO).listarTodos();
  }

  async buscarPorTexto(query: string): Promise<Produto[]> {
    return (this.dao as ProdutoDAO).buscarPorTexto(query);
  }
}

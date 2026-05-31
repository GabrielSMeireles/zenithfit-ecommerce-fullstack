import type { IFachada } from '../interfaces/IFachada.js';
import { Produto } from '../entities/Produto.js';
import { ProdutoDAO } from '../dao/ProdutoDAO.js';

export class ProdutoService implements IFachada<Produto> {
  private dao = new ProdutoDAO();

  async salvar(produto: Produto): Promise<Produto> {
    return this.dao.salvar(produto);
  }

  async alterar(produto: Produto): Promise<Produto> {
    return this.dao.alterar(produto);
  }

  async consultar(id: number): Promise<Produto | null> {
    return this.dao.consultar(id);
  }

  async listarTodos(): Promise<Produto[]> {
    return this.dao.listarTodos();
  }

  async buscarPorTexto(query: string): Promise<Produto[]> {
    return this.dao.buscarPorTexto(query);
  }

  async deletar(id: number): Promise<void> {
    await this.dao.deletar(id);
  }
}

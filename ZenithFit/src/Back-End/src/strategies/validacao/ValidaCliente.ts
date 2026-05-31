import type { IStrategy } from '../../interfaces/IStrategy.js';
import { Cliente } from '../../entities/Cliente.js';

export class ValidaCliente implements IStrategy<Cliente> {
  async validar(cliente: Cliente): Promise<void> {
    if (!cliente.cd_cpf || cliente.cd_cpf.trim().length !== 11) {
      throw new Error('CPF inválido: deve conter 11 dígitos.');
    }
    if (!cliente.nm_nome_cliente || cliente.nm_nome_cliente.trim().length < 2) {
      throw new Error('Nome do cliente é obrigatório.');
    }
    if (!cliente.nm_email || !cliente.nm_email.includes('@')) {
      throw new Error('E-mail inválido.');
    }
    if (!cliente.cd_senha || cliente.cd_senha.length < 6) {
      throw new Error('Senha deve ter no mínimo 6 caracteres.');
    }
    if (!cliente.dt_nascimento) {
      throw new Error('Data de nascimento é obrigatória.');
    }
    if (!cliente.cd_DDD || !cliente.cd_telefone) {
      throw new Error('Telefone (DDD + número) é obrigatório.');
    }
  }
}

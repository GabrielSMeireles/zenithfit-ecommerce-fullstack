import { prisma } from '../db.js';
import type { IDAO } from '../interfaces/IDAO.js';
import { Cliente } from '../entities/Cliente.js';

export class ClienteDAO implements IDAO<Cliente> {

  async salvar(cliente: Cliente): Promise<Cliente> {
    const result = await prisma.cliente.create({
      data: {
        cd_cpf: cliente.cd_cpf,
        nm_nome_cliente: cliente.nm_nome_cliente,
        dt_nascimento: cliente.dt_nascimento,
        cd_telefone: cliente.cd_telefone,
        cd_DDD: cliente.cd_DDD,
        nm_identificacao_telefone: cliente.nm_identificacao_telefone,
        nm_email: cliente.nm_email,
        cd_senha: cliente.cd_senha,
        cd_genero: cliente.cd_genero,
        cd_tipo_telefone: cliente.cd_tipo_telefone,
        cd_status: cliente.cd_status,
      },
    });
    return Object.assign(new Cliente(), result);
  }

  async alterar(cliente: Cliente): Promise<Cliente> {
    const result = await prisma.cliente.update({
      where: { cd_cpf: cliente.cd_cpf },
      data: {
        nm_nome_cliente: cliente.nm_nome_cliente,
        dt_nascimento: cliente.dt_nascimento,
        cd_telefone: cliente.cd_telefone,
        cd_DDD: cliente.cd_DDD,
        nm_identificacao_telefone: cliente.nm_identificacao_telefone,
        nm_email: cliente.nm_email,
        cd_genero: cliente.cd_genero,
        cd_tipo_telefone: cliente.cd_tipo_telefone,
        cd_status: cliente.cd_status,
        ...(cliente.cd_senha ? { cd_senha: cliente.cd_senha } : {}),
      },
    });
    return Object.assign(new Cliente(), result);
  }

  async consultar(cpf: string): Promise<Cliente | null> {
    const result = await prisma.cliente.findUnique({
      where: { cd_cpf: cpf.trim() },
      include: {
        genero: true,
        tipo_telefone: true,
        status_cliente: true,
        enderecos: true,
        cartoes: { include: { bandeira: true } },
      },
    });
    if (!result) return null;
    return Object.assign(new Cliente(), result);
  }

  async listarTodos(): Promise<Cliente[]> {
    const result = await prisma.cliente.findMany({
      include: {
        genero: true,
        tipo_telefone: true,
        status_cliente: true,
        enderecos: true,
        cartoes: { include: { bandeira: true } },
      },
    });
    return result.map(r => Object.assign(new Cliente(), r));
  }

  async deletar(cpf: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await tx.cartao_credito.deleteMany({ where: { cd_cpf: cpf } });
      await tx.endereco.deleteMany({ where: { cd_cpf: cpf } });
      await tx.cliente.delete({ where: { cd_cpf: cpf } });
    });
  }

  async buscarPorEmail(email: string): Promise<Cliente | null> {
    const result = await prisma.cliente.findFirst({ where: { nm_email: email } });
    if (!result) return null;
    return Object.assign(new Cliente(), result);
  }
}

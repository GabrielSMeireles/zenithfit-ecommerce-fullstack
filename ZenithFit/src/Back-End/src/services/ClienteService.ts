import { Fachada } from './Fachada.js';
import { Cliente } from '../entities/Cliente.js';
import { ClienteDAO } from '../dao/ClienteDAO.js';
import { EnderecoDAO } from '../dao/EnderecoDAO.js';
import { CartaoDAO } from '../dao/CartaoDAO.js';
import { ValidaCliente } from '../strategies/validacao/ValidaCliente.js';
import { GeraMensagem } from '../notification/GeraMensagem.js';
import { prisma } from '../db.js';

export class ClienteService extends Fachada<Cliente> {
  private validacao = new ValidaCliente();
  private notificacao = new GeraMensagem();

  constructor() {
    super(new ClienteDAO());
  }

  async salvar(dados: any): Promise<Cliente> {
    const cliente = Object.assign(new Cliente(), {
      cd_cpf: dados.cpf,
      nm_nome_cliente: dados.nm_nome_cliente,
      dt_nascimento: dados.dt_nascimento ? new Date(dados.dt_nascimento) : new Date(),
      cd_telefone: dados.cd_telefone,
      cd_DDD: dados.cd_DDD,
      nm_identificacao_telefone: dados.nm_identificacao_telefone || 'Celular',
      nm_email: dados.nm_email,
      cd_senha: dados.cd_senha || '123456',
      cd_genero: Number(dados.cd_genero) || 1,
      cd_tipo_telefone: Number(dados.cd_tipo_telefone) || 1,
      cd_status: 1,
    });

    await this.validacao.validar(cliente);

    const resultado = await prisma.$transaction(async (tx) => {
      return tx.cliente.create({
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
          enderecos: {
            create: (dados.enderecos || []).map((end: any) => ({
              nm_identificacao: end.nm_identificacao || 'Casa',
              cd_cep: end.cd_cep,
              nm_logradouro: end.nm_logradouro,
              cd_numero: end.cd_numero,
              nm_bairro: end.nm_bairro,
              nm_cidade: end.nm_cidade,
              sg_estado: end.sg_uf || 'SP',
              nm_tipo_endereco: end.nm_tipo_endereco || 'Ambos',
            })),
          },
          cartoes: {
            create: (dados.cartoes || []).map((c: any) => ({
              cd_numero_cartao: c.cd_numero_cartao,
              nm_nome_impresso_cartao: c.nm_nome_impresso_cartao,
              cd_seguranca: c.cd_seguranca,
              dt_validade_cartao: new Date(c.dt_validade_cartao),
              cd_bandeira: Number(c.cd_bandeira),
              cartao_preferencial: c.cartao_preferencial ?? false,
            })),
          },
        },
      });
    });

    this.notificacao.log('CADASTRO', `Novo cliente: ${cliente.nm_nome_cliente} (${cliente.cd_cpf})`);
    return Object.assign(new Cliente(), resultado);
  }

  async alterar(dados: any): Promise<Cliente> {
    const cliente = Object.assign(new Cliente(), {
      cd_cpf: dados.cd_cpf,
      nm_nome_cliente: dados.nm_nome_cliente,
      dt_nascimento: dados.dt_nascimento ? new Date(dados.dt_nascimento) : undefined,
      cd_telefone: dados.cd_telefone,
      cd_DDD: dados.cd_DDD,
      nm_email: dados.nm_email,
      cd_senha: dados.nm_senha || dados.cd_senha,
      cd_genero: Number(dados.cd_genero),
      cd_tipo_telefone: Number(dados.cd_tipo_telefone),
      cd_status: Number(dados.cd_status),
      nm_identificacao_telefone: dados.nm_identificacao_telefone || 'Celular',
    });

    const resultado = await prisma.$transaction(async (tx) => {
      await tx.endereco.deleteMany({ where: { cd_cpf: cliente.cd_cpf } });
      await tx.cartao_credito.deleteMany({ where: { cd_cpf: cliente.cd_cpf } });
      return tx.cliente.update({
        where: { cd_cpf: cliente.cd_cpf },
        data: {
          nm_nome_cliente: cliente.nm_nome_cliente,
          dt_nascimento: cliente.dt_nascimento,
          cd_genero: cliente.cd_genero,
          cd_status: cliente.cd_status,
          cd_tipo_telefone: cliente.cd_tipo_telefone,
          cd_DDD: cliente.cd_DDD,
          cd_telefone: cliente.cd_telefone,
          ...(cliente.cd_senha ? { cd_senha: cliente.cd_senha } : {}),
          enderecos: {
            create: (dados.enderecos || []).map((end: any) => ({
              nm_identificacao: end.nm_identificacao || 'Casa',
              cd_cep: end.cd_cep,
              nm_logradouro: end.nm_logradouro,
              cd_numero: end.cd_numero,
              nm_bairro: end.nm_bairro,
              nm_cidade: end.nm_cidade,
              sg_estado: end.sg_uf || end.sg_estado || 'SP',
              nm_tipo_endereco: end.nm_tipo_endereco || 'Entrega',
            })),
          },
          cartoes: {
            create: (dados.cartoes || []).map((c: any) => ({
              cd_numero_cartao: c.cd_numero_cartao,
              nm_nome_impresso_cartao: c.nm_nome_impresso_cartao,
              cd_seguranca: c.cd_seguranca || '000',
              dt_validade_cartao: new Date(c.dt_validade_cartao),
              cd_bandeira: Number(c.cd_bandeira || 1),
              cartao_preferencial: !!c.cartao_preferencial,
            })),
          },
        },
      });
    });

    return Object.assign(new Cliente(), resultado);
  }

  async listarTodos(): Promise<Cliente[]> {
    return (this.dao as ClienteDAO).listarTodos();
  }

  async login(email: string, senha: string): Promise<Omit<Cliente, 'cd_senha'> | null> {
    const cliente = await (this.dao as ClienteDAO).buscarPorEmail(email);
    if (!cliente || (cliente as any).cd_senha !== senha) return null;
    const { cd_senha, ...semSenha } = cliente as any;
    return semSenha;
  }
}

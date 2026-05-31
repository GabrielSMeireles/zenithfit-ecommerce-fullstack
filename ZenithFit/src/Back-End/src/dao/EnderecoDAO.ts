import { prisma } from '../db.js';
import type { IDAO } from '../interfaces/IDAO.js';
import { Endereco } from '../entities/Endereco.js';

export class EnderecoDAO implements IDAO<Endereco> {

  async salvar(endereco: Endereco): Promise<Endereco> {
    const result = await prisma.endereco.create({
      data: {
        cd_cpf: endereco.cd_cpf,
        cd_cep: endereco.cd_cep,
        nm_logradouro: endereco.nm_logradouro,
        cd_numero: endereco.cd_numero,
        nm_bairro: endereco.nm_bairro,
        nm_cidade: endereco.nm_cidade,
        sg_estado: endereco.sg_estado,
        nm_tipo_endereco: endereco.nm_tipo_endereco ?? 'Entrega',
        nm_identificacao: endereco.nm_identificacao ?? 'Casa',
      },
    });
    return Object.assign(new Endereco(), result);
  }

  async alterar(endereco: Endereco): Promise<Endereco> {
    const result = await prisma.endereco.update({
      where: { cd_endereco: endereco.cd_endereco },
      data: endereco,
    });
    return Object.assign(new Endereco(), result);
  }

  async consultar(id: number): Promise<Endereco | null> {
    const result = await prisma.endereco.findUnique({ where: { cd_endereco: id } });
    if (!result) return null;
    return Object.assign(new Endereco(), result);
  }

  async deletar(id: number): Promise<void> {
    await prisma.endereco.delete({ where: { cd_endereco: id } });
  }
}

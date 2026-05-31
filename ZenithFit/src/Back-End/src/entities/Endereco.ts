import { EntidadeDominio } from './EntidadeDominio.js';

export class Endereco extends EntidadeDominio {
  cd_endereco?: number;
  cd_cep!: string;
  nm_logradouro!: string;
  cd_numero!: string;
  nm_bairro!: string;
  nm_cidade!: string;
  sg_estado!: string;
  nm_tipo_endereco?: string;
  nm_identificacao?: string;
  cd_cpf!: string;
}

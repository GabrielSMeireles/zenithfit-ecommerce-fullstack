import { EntidadeDominio } from './EntidadeDominio.js';

export class Cliente extends EntidadeDominio {
  cd_cpf!: string;
  nm_nome_cliente!: string;
  dt_nascimento!: Date;
  cd_telefone!: string;
  cd_DDD!: string;
  nm_identificacao_telefone!: string;
  nm_email!: string;
  cd_senha!: string;
  cd_rank_cliente?: number;
  cd_genero!: number;
  cd_tipo_telefone!: number;
  cd_status!: number;
}

import { EntidadeDominio } from './EntidadeDominio.js';

export class Cartao extends EntidadeDominio {
  cd_cartao?: number;
  cd_numero_cartao!: string;
  nm_nome_impresso_cartao!: string;
  cd_seguranca!: string;
  dt_validade_cartao!: Date;
  cartao_preferencial?: boolean;
  cd_bandeira!: number;
  cd_cpf!: string;
}

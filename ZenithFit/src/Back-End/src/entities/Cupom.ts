import { EntidadeDominio } from './EntidadeDominio.js';

export class Cupom extends EntidadeDominio {
  cd_cupom?: number;
  nm_codigo!: string;
  vl_desconto!: number;
  tp_cupom!: 'PROMOCIONAL' | 'TROCA';
  fl_ativo!: boolean;
}

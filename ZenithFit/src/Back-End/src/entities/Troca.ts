import { EntidadeDominio } from './EntidadeDominio.js';

export class Troca extends EntidadeDominio {
  cd_troca?: number;
  dt_solicitacao?: Date;
  ds_motivo!: string;
  ds_descricao?: string;
  cd_status_troca?: number;
  cd_pedido!: number;
  cd_item?: number;
  cd_cupom?: number;
}

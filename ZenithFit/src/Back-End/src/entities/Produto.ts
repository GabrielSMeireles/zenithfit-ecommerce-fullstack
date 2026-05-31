import { EntidadeDominio } from './EntidadeDominio.js';

export class Produto extends EntidadeDominio {
  cd_produto?: number;
  nm_produto!: string;
  ds_produto?: string;
  vl_produto!: number;
  nm_imagem_url?: string;
  qt_estoque!: number;
}

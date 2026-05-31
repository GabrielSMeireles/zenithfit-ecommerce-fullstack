import { Fachada } from './Fachada.js';
import { Cartao } from '../entities/Cartao.js';
import { CartaoDAO } from '../dao/CartaoDAO.js';

export class CartaoService extends Fachada<Cartao> {
  constructor() {
    super(new CartaoDAO());
  }

}

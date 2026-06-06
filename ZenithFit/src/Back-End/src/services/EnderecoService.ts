import { Fachada } from './Fachada.js';
import { Endereco } from '../entities/Endereco.js';
import { EnderecoDAO } from '../dao/EnderecoDAO.js';

export class EnderecoService extends Fachada<Endereco> {
  constructor() {
    super(new EnderecoDAO());
  }

}

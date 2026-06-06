import { Router } from 'express';
import { EnderecoController } from '../controllers/EnderecoController.js';

const router = Router();
const ctrl = new EnderecoController();

router.post('/', ctrl.adicionar);
router.get('/:id', ctrl.buscar);
router.delete('/:id', ctrl.deletar);

export default router;

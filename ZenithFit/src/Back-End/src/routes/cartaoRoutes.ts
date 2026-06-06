import { Router } from 'express';
import { CartaoController } from '../controllers/CartaoController.js';

const router = Router();
const ctrl = new CartaoController();

router.post('/', ctrl.adicionar);
router.get('/:id', ctrl.buscar);
router.delete('/:id', ctrl.deletar);

export default router;

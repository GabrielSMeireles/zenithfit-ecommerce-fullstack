import { Router } from 'express';
import { TrocaController } from '../controllers/TrocaController.js';

const router = Router();
const ctrl = new TrocaController();

router.post('/', ctrl.criar);
router.get('/', ctrl.listar);
router.get('/:id', ctrl.buscar);
router.patch('/:id/status', ctrl.atualizarStatus);

export default router;

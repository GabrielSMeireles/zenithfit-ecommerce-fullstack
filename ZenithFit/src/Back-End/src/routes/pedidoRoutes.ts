import { Router } from 'express';
import { PedidoController } from '../controllers/PedidoController.js';

const router = Router();
const ctrl = new PedidoController();

router.post('/', ctrl.criar);
router.get('/', ctrl.listar);
router.get('/:cpf', ctrl.listarPorCliente);
router.patch('/:id/status', ctrl.atualizarStatus);

export default router;

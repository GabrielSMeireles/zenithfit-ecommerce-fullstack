import { Router } from 'express';
import { ClienteController } from '../controllers/ClienteController.js';

const router = Router();
const ctrl = new ClienteController();

router.post('/', ctrl.criar);
router.get('/', ctrl.listar);
router.get('/:cpf', ctrl.buscar);
router.put('/:cpf', ctrl.atualizar);
router.delete('/:cpf', ctrl.deletar);

export default router;

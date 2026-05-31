import { Router } from 'express';
import { ProdutoController } from '../controllers/ProdutoController.js';

const router = Router();
const ctrl = new ProdutoController();

router.get('/', ctrl.listar);
router.get('/:id', ctrl.buscar);

export default router;

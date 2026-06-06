import { Router } from 'express';
import { AnaliseController } from '../controllers/AnaliseController.js';

const router = Router();
const ctrl = new AnaliseController();

router.get('/vendas-por-categoria', ctrl.obterDadosGrafico);
router.get('/categorias', ctrl.listarCategorias);

export default router;
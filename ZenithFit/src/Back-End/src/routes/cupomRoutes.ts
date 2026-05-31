import { Router } from 'express';
import { CupomController } from '../controllers/CupomController.js';

const router = Router();
const ctrl = new CupomController();

router.get('/:codigo', ctrl.validar);

export default router;

import { Router } from 'express';
import { ChatbotController } from '../controllers/ChatbotController.js';

const router = Router();
const ctrl = new ChatbotController();

router.post('/', ctrl.responder);

export default router;

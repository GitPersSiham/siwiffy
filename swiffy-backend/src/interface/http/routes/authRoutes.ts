import { Router } from 'express';
import { authController } from '../controllers/AuthController';

const router = Router();

router.post('/login', authController.login as any);
router.post('/register', authController.register as any);

export default router;

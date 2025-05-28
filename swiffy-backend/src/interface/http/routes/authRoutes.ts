import express from 'express';

import { body } from 'express-validator';
import { loginController } from '../controllers/AuthController';

const router = express.Router();

router.post(
  '/login',
  [body('email').isEmail().normalizeEmail(), body('password').notEmpty()],
  loginController
);

export default router;

// interface/http/routes/paymentRoutes.ts
import { Router, Request, Response } from 'express';
import { PaymentController } from '../controllers/paymentController';

const router = Router();
const paymentController = new PaymentController();

// Wrapper les méthodes du contrôleur pour gérer correctement le typage
const createCheckoutSessionHandler = async (req: Request, res: Response) => {
  await paymentController.createCheckoutSession(req, res);
};

const createPaymentHandler = async (req: Request, res: Response) => {
  await paymentController.createPayment(req, res);
};

const retrievePaymentIntentHandler = async (req: Request, res: Response) => {
  await paymentController.retrievePaymentIntent(req, res);
};

// Routes
router.post('/create-checkout-session', createCheckoutSessionHandler);
router.post('/create-intent', createPaymentHandler);
router.get('/retrieve-intent/:paymentIntentId', retrievePaymentIntentHandler);

export const paymentRoutes = router;

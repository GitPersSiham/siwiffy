import { Request, Response } from 'express';
import { StripeService } from '../../../infrastracture/services/stripeService';
import { CreateStripePayment } from '../../../application/use-cases/CreateStripePayment';

export class PaymentController {
  private stripeService: StripeService;
  private createStripePayment: CreateStripePayment;

  constructor() {
    this.stripeService = new StripeService();
    this.createStripePayment = new CreateStripePayment(this.stripeService);
  }

  async createPayment(req: Request, res: Response) {
    try {
      const { bookingId, amount } = req.body;
      if (!bookingId || !amount) {
        return res.status(400).json({ 
          success: false,
          message: 'bookingId et amount sont requis' 
        });
      }
      const result = await this.createStripePayment.execute(bookingId, amount);
      res.json({ 
        success: true,
        ...result 
      });
    } catch (error: any) {
      console.error('Erreur lors de la création du paiement:', error);
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  }

  async retrievePaymentIntent(req: Request, res: Response) {
    try {
      const { paymentIntentId } = req.params;
      if (!paymentIntentId) {
        return res.status(400).json({ 
          success: false,
          message: 'paymentIntentId est requis' 
        });
      }
      const paymentIntent = await this.stripeService.retrievePaymentIntent(paymentIntentId);
      res.json({ 
        success: true,
        clientSecret: paymentIntent.client_secret 
      });
    } catch (error: any) {
      console.error('Erreur lors de la récupération de l\'intention de paiement:', error);
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  }

  async createCheckoutSession(req: Request, res: Response) {
    try {
      const { userId, price } = req.body;

      if (!userId || !price) {
        return res.status(400).json({
          success: false,
          error: 'userId et price sont requis'
        });
      }

      const result = await this.stripeService.createCheckoutSession(userId, price);
      
      return res.json({
        success: true,
        url: result.url
      });
    } catch (error: any) {
      console.error('Erreur lors de la création de la session:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Erreur lors de la création de la session de paiement'
      });
    }
  }
}

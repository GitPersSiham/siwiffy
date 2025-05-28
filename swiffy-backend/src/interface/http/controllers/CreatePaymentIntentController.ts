import { Request, Response } from 'express';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-03-31.basil',
});

export class CreatePaymentIntentController {
  async execute(req: Request, res: Response) {
    try {
      const { amount, bookingId } = req.body;

      if (!amount || !bookingId) {
        return res.status(400).json({
          success: false,
          message: 'Montant et ID de réservation requis',
        });
      }

      // Créer l'intention de paiement
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'eur',
        metadata: {
          bookingId,
        },
      });

      return res.status(200).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error: any) {
      console.error('Erreur lors de la création de l\'intention de paiement:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la création de l\'intention de paiement',
        error: error.message,
      });
    }
  }
} 
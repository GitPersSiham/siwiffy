// infrastructure/services/StripeService.ts
import Stripe from 'stripe';

export class StripeService {
  private stripe: Stripe;

  constructor() {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      throw new Error('STRIPE_SECRET_KEY n\'est pas définie dans les variables d\'environnement');
    }

    this.stripe = new Stripe(stripeKey, {
      apiVersion: '2025-03-31.basil',
    });
  }

  async createPaymentIntent(bookingId: string, amount: number): Promise<{ clientSecret: string; url: string }> {
    try {
      // Créer une intention de paiement
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // en centimes
        currency: 'eur',
        payment_method_types: ['card'],
        metadata: {
          bookingId,
        },
      });

      if (!paymentIntent.client_secret) {
        throw new Error('Client secret non généré');
      }

      // Construire l'URL de paiement avec le bon chemin
      const paymentUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment?payment_intent=${paymentIntent.id}`;

      return {
        clientSecret: paymentIntent.client_secret,
        url: paymentUrl
      };
    } catch (error: any) {
      console.error('Erreur Stripe:', error);
      throw new Error('Erreur lors de la création de l\'intention de paiement');
    }
  }

  async retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      if (!paymentIntent.client_secret) {
        throw new Error('Client secret non trouvé');
      }
      return paymentIntent;
    } catch (error: any) {
      console.error('Erreur lors de la récupération de l\'intention de paiement:', error);
      throw new Error('Erreur lors de la récupération de l\'intention de paiement');
    }
  }

  async createCheckoutSession(userId: string, price: number): Promise<{ url: string }> {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Réservation de ménage',
              },
              unit_amount: Math.round(price * 100), // en centimes
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment/cancel`,
        metadata: {
          userId,
        },
      });

      if (!session.url) {
        throw new Error('URL de session non générée');
      }

      return { url: session.url };
    } catch (error: any) {
      console.error('Erreur Stripe:', error);
      throw new Error('Erreur lors de la création de la session de paiement');
    }
  }
}

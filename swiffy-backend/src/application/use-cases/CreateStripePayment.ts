// application/use-cases/CreateStripePayment.ts

import { StripeService } from "../../infrastracture/services/stripeService";


export class CreateStripePayment {
  constructor(private stripeService: StripeService) {}

  async execute(bookingId: string, amount: number): Promise<{ clientSecret: string; url: string }> {
    try {
      const result = await this.stripeService.createPaymentIntent(bookingId, amount);
      if (!result.clientSecret || !result.url) {
        throw new Error('Impossible de créer l\'intention de paiement');
      }
      return result;
    } catch (error: any) {
      throw new Error(`Erreur lors de la création du paiement: ${error.message}`);
    }
  }
}

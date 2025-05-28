// src/application/use-cases/CreateStripeCheckoutSession.ts

import { StripeService } from "../../infrastracture/services/stripeService";


const stripeService = new StripeService();

export async function CreateStripeCheckoutSession(userId: string, price: number) {
  return await stripeService.createCheckoutSession(userId, price);
}

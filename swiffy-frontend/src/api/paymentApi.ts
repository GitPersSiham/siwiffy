// api/paymentApi.ts
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

export const createPaymentSession = async (bookingId: string, amount: number) => {
  try {
    const response = await axios.post(`${API_URL}/payments/create-intent`, {
      bookingId,
      amount
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la création de la session de paiement');
  }
};

export const retrievePaymentIntent = async (paymentIntentId: string) => {
  try {
    const response = await axios.get(`${API_URL}/payments/retrieve-intent/${paymentIntentId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération de l\'intention de paiement');
  }
};

export const createCheckoutSession = async (userId: string, price: number) => {
  try {
    const response = await axios.post(`${API_URL}/payments/create-checkout-session`, {
      userId,
      price
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la création de la session de paiement');
  }
};

// domain/entities/Payment.ts
export interface Payment {
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed';
}

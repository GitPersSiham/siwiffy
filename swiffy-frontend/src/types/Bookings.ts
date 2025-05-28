export interface Booking {
  id: string;
  userId: string;
  packageType: 'Simple' | 'Confort' | 'Premium';
  propertyType: 'Studio' | 'T1' | 'T2' | 'T3' | 'T4';
  options?: {
    windows?: boolean;
    fridge?: boolean;
    ironing?: boolean;
  };
  date: string; 
  adress:string;
  dateStart: string;
  dateEnd: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  amount: number;
  createdAt: string;
}

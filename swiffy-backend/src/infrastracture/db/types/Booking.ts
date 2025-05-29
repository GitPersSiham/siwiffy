export interface BookingRow {
  id: string;
  user_id: string;
  package_type: string;
  property_type: string;
  date: string;
  adress: string;
  duration: number;
  amount: number;
  status: string;
  created_at: string;
  date_start: string;
  date_end: string;
  options: Record<string, boolean>;
}

export interface BookingInsert {
  user_id: string;
  package_type: string;
  property_type: string;
  date: string;
  adress: string;
  duration: number;
  amount: number;
  status: string;
  date_start: string;
  date_end: string;
  options: Record<string, boolean>;
}

export interface BookingUpdate {
  user_id?: string;
  package_type?: string;
  property_type?: string;
  date?: string;
  adress?: string;
  duration?: number;
  amount?: number;
  status?: string;
  date_start?: string;
  date_end?: string;
  options?: Record<string, boolean>;
} 
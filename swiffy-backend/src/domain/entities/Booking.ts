import { toZonedTime } from 'date-fns-tz';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface BookingProps {
  id?: string;
  userId: string;
  packageType: string;
  propertyType: string;
  date: Date;
  adress: string;
  duration: number;
  amount: number;
  status: string;
  createdAt?: Date;
  dateStart: Date;
  dateEnd: Date;
  options: Record<string, boolean>;
}

export class Booking {
  public id: string;
  public userId: string;
  public packageType: string;
  public propertyType: string;
  public date: Date;
  public adress: string;
  public duration: number;
  public amount: number;
  public status: string;
  public createdAt: Date;
  public dateStart: Date;
  public dateEnd: Date;
  public options: Record<string, boolean>;

  constructor(props: BookingProps) {
    this.id = props.id ?? '';
    this.userId = props.userId;
    this.packageType = props.packageType;
    this.propertyType = props.propertyType;
    this.date = props.date;
    this.adress = props.adress;
    this.duration = props.duration;
    this.amount = props.amount;
    this.status = props.status;
    this.createdAt = props.createdAt ?? new Date();
    this.dateStart = props.dateStart;
    this.dateEnd = props.dateEnd;
    this.options = props.options;
  }

  isValidTimeSlot(): boolean {
    // Convertir l'heure UTC en heure locale (Paris)
    const localTime = toZonedTime(this.date, 'Europe/Paris');
    const hour = localTime.getHours();
    return hour >= 8 && hour < 18;
  }
}

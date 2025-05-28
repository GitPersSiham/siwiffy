import { Request, Response } from 'express';
import { FindBookingsId } from '../../../application/use-cases/FindBookingsId';
import { FindAllBookings } from '../../../application/use-cases/FindAllBookings';
import { FindBookingsByUserId } from '../../../application/use-cases/FindBookingsById';
import { BookingRepositoryMongo } from '../../../infrastracture/db/repositories/BookingRepositoryMongo';

const bookingRepository = new BookingRepositoryMongo();

class FindBookingController {
  private getBookingByIdUseCase: FindBookingsId;
  private getBookingsUseCase: FindAllBookings;
  private getBookingsByUserIdUseCase: FindBookingsByUserId;

  constructor() {
    this.getBookingByIdUseCase = new FindBookingsId(bookingRepository);
    this.getBookingsUseCase = new FindAllBookings(bookingRepository);
    this.getBookingsByUserIdUseCase = new FindBookingsByUserId(bookingRepository);
    
    // Binding des méthodes
    this.findById = this.findById.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findByUserId = this.findByUserId.bind(this);
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const booking = await this.getBookingByIdUseCase.execute(id);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      res.json(booking);
    } catch (error) {
      console.error('Error getting booking:', error);
      res.status(500).json({ message: 'Error getting booking' });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const bookings = await this.getBookingsUseCase.execute();
      res.json(bookings);
    } catch (error) {
      console.error('Error getting bookings:', error);
      res.status(500).json({ message: 'Error getting bookings' });
    }
  }

  async findByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const bookings = await this.getBookingsByUserIdUseCase.execute(userId);
      res.json(bookings);
    } catch (error) {
      console.error('Error getting bookings by user:', error);
      res.status(500).json({ message: 'Error getting bookings by user' });
    }
  }
}

export const findBookingController = new FindBookingController(); 
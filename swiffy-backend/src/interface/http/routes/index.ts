import { Router } from 'express';

import { paymentRoutes } from './paymentRoutes';
import bookingRoutes from './booking.routes';

const router = Router();

router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);

export { router }; 
import { Router } from 'express';
//import { authMiddleware } from '../middlware/authMiddleware';
import { checkAvailabilityController } from '../controllers/calendarController';


const router = Router();

router.post('/calendar/check-availability', checkAvailabilityController);

export default router;

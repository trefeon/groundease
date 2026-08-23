import { Router } from 'express';
import {
  createFeedback,
  listFeedback,
  getFeedbackStats,
} from '../controllers/feedback.controller';

const router = Router();

router.post('/', createFeedback);
router.get('/', listFeedback);
router.get('/stats', getFeedbackStats);

export default router;

import { Router } from 'express';
import assessmentRoutes from './assessment.routes';
import sessionRoutes from './session.routes';
import feedbackRoutes from './feedback.routes';

const router = Router();

router.use('/assessments', assessmentRoutes);
router.use('/sessions', sessionRoutes);
router.use('/feedback', feedbackRoutes);

export default router;


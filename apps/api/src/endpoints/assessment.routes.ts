import { Router } from 'express';
import { createAssessment, listAssessments } from '../controllers/assessment.controller';

const router = Router();

router.get('/', listAssessments);
router.post('/', createAssessment);

export default router;


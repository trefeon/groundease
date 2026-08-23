import { Router } from 'express';
import { createSession, getSessionSummary, listSessions } from '../controllers/session.controller';

const router = Router();

router.get('/', listSessions);
router.get('/summary', getSessionSummary);
router.post('/', createSession);

export default router;


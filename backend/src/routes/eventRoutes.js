import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { list, getOne, create, update, remove, setSeatBooked, metrics } from '../controllers/eventController.js';

const router = Router();

// Public: list + details (so users can browse in Module 3)
router.get('/', list);
router.get('/metrics', requireAuth, requireRole('admin'), metrics);
router.get('/:id', getOne);

// Admin only
router.post('/', requireAuth, requireRole('admin'), create);
router.put('/:id', requireAuth, requireRole('admin'), update);
router.delete('/:id', requireAuth, requireRole('admin'), remove);
router.patch('/:id/seat', requireAuth, requireRole('admin'), setSeatBooked);

export default router;

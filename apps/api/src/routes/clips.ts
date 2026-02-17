import { Router } from 'express';
import { createClip, getClips, getClip, updateClip, deleteClip, analyzeClip, generateClips } from '../controllers/clipController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, createClip);
router.get('/', authenticate, getClips);
router.get('/:id', authenticate, getClip);
router.put('/:id', authenticate, updateClip);
router.delete('/:id', authenticate, deleteClip);
router.post('/:id/analyze', authenticate, analyzeClip);
router.post('/generate', authenticate, generateClips);

export default router;

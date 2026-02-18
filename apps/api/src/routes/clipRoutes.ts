import { Router } from 'express';
import { getClips, getClip, createClip, updateClip, deleteClip, suggestClipCuts } from '../controllers/clipController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, getClips);
router.get('/:id', authenticate, getClip);
router.post('/', authenticate, createClip);
router.post('/suggest', authenticate, suggestClipCuts);
router.put('/:id', authenticate, updateClip);
router.delete('/:id', authenticate, deleteClip);

export default router;

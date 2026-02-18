import { Router } from 'express';
import * as captionController from '../controllers/captionController.js';
import { authenticate } from '../middleware/auth.js';
const router = Router();
router.get('/', authenticate, captionController.getCaptions);
router.post('/', authenticate, captionController.createCaption);
router.put('/:id', authenticate, captionController.updateCaption);
router.delete('/:id', authenticate, captionController.deleteCaption);
export default router;

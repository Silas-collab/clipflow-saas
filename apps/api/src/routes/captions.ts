import { Router } from 'express';
import { createCaption, getCaptions, getCaption, updateCaption, deleteCaption, getTemplates, createTemplate } from '../controllers/captionController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, createCaption);
router.get('/', authenticate, getCaptions);
router.get('/templates', getTemplates);
router.post('/templates', authenticate, createTemplate);
router.get('/:id', authenticate, getCaption);
router.put('/:id', authenticate, updateCaption);
router.delete('/:id', authenticate, deleteCaption);

export default router;

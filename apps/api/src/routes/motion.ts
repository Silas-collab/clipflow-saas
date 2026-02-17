import { Router } from 'express';
import { createProject, getProjects, getProject, generateVideo, deleteProject } from '../controllers/motionController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, createProject);
router.get('/', authenticate, getProjects);
router.get('/:id', authenticate, getProject);
router.post('/:id/generate', authenticate, generateVideo);
router.delete('/:id', authenticate, deleteProject);

export default router;

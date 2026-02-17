import { Router } from 'express';
import { uploadVideo, getVideos, getVideo, deleteVideo, processVideo } from '../controllers/videoController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, uploadVideo);
router.get('/', authenticate, getVideos);
router.get('/:id', authenticate, getVideo);
router.delete('/:id', authenticate, deleteVideo);
router.post('/:id/process', authenticate, processVideo);

export default router;

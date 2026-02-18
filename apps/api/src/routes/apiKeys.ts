import { Router } from 'express';
import * as apiKeyController from '../controllers/apiKeyController.js';
import { authenticate } from '../middleware/auth.js';
const router = Router();
router.get('/', authenticate, apiKeyController.getApiKeys);
router.post('/', authenticate, apiKeyController.createApiKey);
router.delete('/:id', authenticate, apiKeyController.deleteApiKey);
export default router;

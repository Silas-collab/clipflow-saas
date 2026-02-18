import { Router } from 'express';
import * as usersController from '../controllers/usersController.js';
import { authenticate } from '../middleware/auth.js';
const router = Router();
router.get('/', authenticate, usersController.getUsers);
router.get('/:id', authenticate, usersController.getUser);
router.put('/:id', authenticate, usersController.updateUser);
router.delete('/:id', authenticate, usersController.deleteUser);
export default router;

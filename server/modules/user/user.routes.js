import express from 'express';
const router = express.Router();
import userController from './user.controller.js';
import { authenticate, authorize } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { updateProfileSchema, changePasswordSchema } from './user.validation.js';

router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, validate({ body: updateProfileSchema }), userController.updateProfile);
router.put('/change-password', authenticate, validate({ body: changePasswordSchema }), userController.changePassword);

router.get('/admin/users', authenticate, authorize('admin'), userController.getAllUsers);
router.patch('/admin/users/:id/toggle-status', authenticate, authorize('admin'), userController.toggleUserStatus);

export default router;

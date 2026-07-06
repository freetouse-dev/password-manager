import express from 'express';
const router = express.Router();
import passwordController from './password.controller.js';
import { authenticate, authorize } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { createPasswordSchema, updatePasswordSchema } from './password.validation.js';

router.use(authenticate);

router.get('/categories', passwordController.getCategories);
router.get('/dashboard/stats', passwordController.getDashboardStats);

router.get('/admin/stats', authorize('admin'), passwordController.getAdminStats);

router.post('/', validate({ body: createPasswordSchema }), passwordController.create);
router.get('/', passwordController.getAll);
router.get('/:id', passwordController.getById);
router.put('/:id', validate({ body: updatePasswordSchema }), passwordController.update);
router.delete('/:id', passwordController.delete);

export default router;

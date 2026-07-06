import passwordService from './password.service.js';
import ApiResponse from '../../shared/response.js';

class PasswordController {
  async create(req, res, next) {
    try {
      const entry = await passwordService.create(req.user.id, req.body);
      const { encrypted_password, ...safeEntry } = entry;
      return ApiResponse.created(res, safeEntry, 'Password saved');
    } catch (err) { next(err); }
  }

  async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const category = req.query.category || null;
      const search = req.query.search || null;
      const { passwords, total } = await passwordService.getAll(req.user.id, page, limit, category, search);
      return ApiResponse.paginated(res, passwords, total, page, limit);
    } catch (err) { next(err); }
  }

  async getById(req, res, next) {
    try {
      const entry = await passwordService.getDecrypted(req.user.id, parseInt(req.params.id));
      return ApiResponse.success(res, entry);
    } catch (err) { next(err); }
  }

  async update(req, res, next) {
    try {
      const entry = await passwordService.update(req.user.id, parseInt(req.params.id), req.body);
      const { encrypted_password, ...safeEntry } = entry;
      return ApiResponse.success(res, safeEntry, 'Password updated');
    } catch (err) { next(err); }
  }

  async delete(req, res, next) {
    try {
      await passwordService.delete(req.user.id, parseInt(req.params.id));
      return ApiResponse.success(res, null, 'Password deleted');
    } catch (err) { next(err); }
  }

  async getCategories(req, res, next) {
    try {
      const categories = await passwordService.getCategories(req.user.id);
      return ApiResponse.success(res, categories);
    } catch (err) { next(err); }
  }

  async getDashboardStats(req, res, next) {
    try {
      const stats = await passwordService.getDashboardStats(req.user.id);
      return ApiResponse.success(res, stats);
    } catch (err) { next(err); }
  }

  async getAdminStats(req, res, next) {
    try {
      const stats = await passwordService.getAdminStats();
      return ApiResponse.success(res, stats);
    } catch (err) { next(err); }
  }
}

export default new PasswordController();

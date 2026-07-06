import userService from './user.service.js';
import ApiResponse from '../../shared/response.js';

class UserController {
  async getProfile(req, res, next) {
    try {
      const user = await userService.getProfile(req.user.id);
      return ApiResponse.success(res, user);
    } catch (err) { next(err); }
  }

  async updateProfile(req, res, next) {
    try {
      const user = await userService.updateProfile(req.user.id, req.body);
      return ApiResponse.success(res, user, 'Profile updated');
    } catch (err) { next(err); }
  }

  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      await userService.changePassword(req.user.id, currentPassword, newPassword);
      return ApiResponse.success(res, null, 'Password changed successfully');
    } catch (err) { next(err); }
  }

  async getAllUsers(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const { users, total } = await userService.getAllUsers(page, limit);
      return ApiResponse.paginated(res, users, total, page, limit);
    } catch (err) { next(err); }
  }

  async toggleUserStatus(req, res, next) {
    try {
      const result = await userService.toggleUserStatus(req.params.id);
      return ApiResponse.success(res, result, 'User status updated');
    } catch (err) { next(err); }
  }
}

export default new UserController();

import authService from './auth.service.js';
import pool from '../../config/db.js';
import ApiResponse from '../../shared/response.js';

class AuthController {
  async register(req, res, next) {
    try {
      const user = await authService.register(req.body);
      return ApiResponse.created(res, user, 'Registration successful');
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { identifier, password } = req.body;
      const result = await authService.login(identifier, password);
      return ApiResponse.success(res, result, 'Login successful');
    } catch (err) {
      next(err);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return ApiResponse.error(res, 'Refresh token is required', 400);
      }
      const tokens = await authService.refreshAccessToken(refreshToken);
      return ApiResponse.success(res, tokens, 'Token refreshed');
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;
      await authService.logout(refreshToken);
      return ApiResponse.success(res, null, 'Logged out successfully');
    } catch (err) {
      next(err);
    }
  }

  async logoutAll(req, res, next) {
    try {
      await authService.logoutAll(req.user.id);
      return ApiResponse.success(res, null, 'Logged out from all devices');
    } catch (err) {
      next(err);
    }
  }

  async me(req, res, next) {
    try {
      const [users] = await pool.query(
        'SELECT id, username, email, full_name, role, avatar_url, is_active, last_login, created_at, updated_at FROM users WHERE id = ?',
        [req.user.id]
      );
      if (users.length === 0) {
        return ApiResponse.error(res, 'User not found', 404);
      }
      return ApiResponse.success(res, users[0]);
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController();

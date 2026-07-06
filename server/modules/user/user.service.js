import bcrypt from 'bcryptjs';
import pool from '../../config/db.js';
import { AppError } from '../../middlewares/errorHandler.js';

class UserService {
  async getProfile(userId) {
    const [users] = await pool.query(
      'SELECT id, username, email, full_name, role, avatar_url, is_active, last_login, created_at, updated_at FROM users WHERE id = ?',
      [userId]
    );
    if (users.length === 0) throw new AppError('User not found', 404);
    return users[0];
  }

  async updateProfile(userId, updateData) {
    const { fullName, email } = updateData;

    if (email) {
      const [existing] = await pool.query(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, userId]
      );
      if (existing.length > 0) throw new AppError('Email already in use', 409);
    }

    const fields = [];
    const values = [];
    if (fullName) { fields.push('full_name = ?'); values.push(fullName); }
    if (email) { fields.push('email = ?'); values.push(email); }

    if (fields.length === 0) throw new AppError('No fields to update', 400);

    values.push(userId);
    await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);

    return this.getProfile(userId);
  }

  async changePassword(userId, currentPassword, newPassword) {
    const [users] = await pool.query('SELECT password FROM users WHERE id = ?', [userId]);
    if (users.length === 0) throw new AppError('User not found', 404);

    const isMatch = await bcrypt.compare(currentPassword, users[0].password);
    if (!isMatch) throw new AppError('Current password is incorrect', 400);

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
  }

  async getAllUsers(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const [rows] = await pool.query(
      'SELECT id, username, email, full_name, role, is_active, last_login, created_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM users');
    return { users: rows, total };
  }

  async toggleUserStatus(userId) {
    const [users] = await pool.query('SELECT is_active FROM users WHERE id = ?', [userId]);
    if (users.length === 0) throw new AppError('User not found', 404);

    const newStatus = !users[0].is_active;
    await pool.query('UPDATE users SET is_active = ? WHERE id = ?', [newStatus, userId]);
    return { is_active: newStatus };
  }
}

export default new UserService();

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../../config/db.js';
import env from '../../config/env.js';
import { AppError } from '../../middlewares/errorHandler.js';

const SALT_ROUNDS = 12;

class AuthService {
  async register(userData) {
    const { username, email, password, fullName } = userData;

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, full_name, role) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashedPassword, fullName, 'user']
    );

    const [users] = await pool.query(
      'SELECT id, username, email, full_name, role, created_at FROM users WHERE id = ?',
      [result.insertId]
    );

    return users[0];
  }

  async login(identifier, password) {
    const [users] = await pool.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [identifier, identifier]
    );

    if (users.length === 0) {
      throw new AppError('Invalid credentials', 401);
    }

    const user = users[0];

    if (!user.is_active) {
      throw new AppError('Account is disabled', 403);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    await this.storeRefreshToken(user.id, refreshToken);

    await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  generateAccessToken(user) {
    return jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      env.jwt.secret,
      { expiresIn: env.jwt.expiresIn }
    );
  }

  generateRefreshToken(user) {
    return jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      env.jwt.refreshSecret,
      { expiresIn: env.jwt.refreshExpiresIn }
    );
  }

  async storeRefreshToken(userId, refreshToken) {
    const decoded = jwt.decode(refreshToken);
    const expiresAt = new Date(decoded.exp * 1000);
    await pool.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [userId, refreshToken, expiresAt]
    );
  }

  async refreshAccessToken(refreshToken) {
    const [storedTokens] = await pool.query(
      'SELECT * FROM refresh_tokens WHERE token = ? AND is_revoked = FALSE',
      [refreshToken]
    );

    if (storedTokens.length === 0) {
      throw new AppError('Invalid refresh token', 401);
    }

    const storedToken = storedTokens[0];

    if (new Date() > new Date(storedToken.expires_at)) {
      await pool.query('UPDATE refresh_tokens SET is_revoked = TRUE WHERE id = ?', [storedToken.id]);
      throw new AppError('Refresh token expired', 401);
    }

    try {
      const decoded = jwt.verify(refreshToken, env.jwt.refreshSecret);

      const [users] = await pool.query(
        'SELECT * FROM users WHERE id = ? AND is_active = TRUE',
        [decoded.id]
      );

      if (users.length === 0) {
        throw new AppError('User not found or inactive', 401);
      }

      const newAccessToken = this.generateAccessToken(users[0]);
      const newRefreshToken = this.generateRefreshToken(users[0]);

      await pool.query('UPDATE refresh_tokens SET is_revoked = TRUE WHERE id = ?', [storedToken.id]);
      await this.storeRefreshToken(users[0].id, newRefreshToken);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (err) {
      if (err instanceof AppError) throw err;
      await pool.query('UPDATE refresh_tokens SET is_revoked = TRUE WHERE id = ?', [storedToken.id]);
      throw new AppError('Invalid refresh token', 401);
    }
  }

  async logout(refreshToken) {
    if (refreshToken) {
      await pool.query('UPDATE refresh_tokens SET is_revoked = TRUE WHERE token = ?', [refreshToken]);
    }
  }

  async logoutAll(userId) {
    await pool.query(
      'UPDATE refresh_tokens SET is_revoked = TRUE WHERE user_id = ?',
      [userId]
    );
  }
}

export default new AuthService();

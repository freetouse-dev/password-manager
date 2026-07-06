import pool from '../../config/db.js';
import { encrypt, decrypt } from '../../config/encryption.js';
import { AppError } from '../../middlewares/errorHandler.js';

class PasswordService {
  async create(userId, data) {
    const { siteName, siteUrl, username, password, category, notes } = data;
    const encryptedPassword = encrypt(password);

    const [result] = await pool.query(
      `INSERT INTO passwords (user_id, site_name, site_url, site_username, encrypted_password, category, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, siteName, siteUrl, username, encryptedPassword, category || 'General', notes || null]
    );

    return this.getById(userId, result.insertId);
  }

  async getAll(userId, page = 1, limit = 20, category = null, search = null) {
    const offset = (page - 1) * limit;
    let query = 'SELECT id, user_id, site_name, site_url, site_username, category, notes, last_used, created_at, updated_at FROM passwords WHERE user_id = ?';
    let countQuery = 'SELECT COUNT(*) as total FROM passwords WHERE user_id = ?';
    const params = [userId];
    const countParams = [userId];

    if (category) {
      query += ' AND category = ?';
      countQuery += ' AND category = ?';
      params.push(category);
      countParams.push(category);
    }
    if (search) {
      query += ' AND (site_name LIKE ? OR site_url LIKE ? OR site_username LIKE ?)';
      countQuery += ' AND (site_name LIKE ? OR site_url LIKE ? OR site_username LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
      countParams.push(searchPattern, searchPattern, searchPattern);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    const [[{ total }]] = await pool.query(countQuery, countParams);

    return { passwords: rows, total };
  }

  async getById(userId, passwordId) {
    const [rows] = await pool.query(
      'SELECT * FROM passwords WHERE id = ? AND user_id = ?',
      [passwordId, userId]
    );
    if (rows.length === 0) throw new AppError('Password entry not found', 404);
    return rows[0];
  }

  async getDecrypted(userId, passwordId) {
    const entry = await this.getById(userId, passwordId);
    entry.decrypted_password = decrypt(entry.encrypted_password);
    delete entry.encrypted_password;

    await pool.query('UPDATE passwords SET last_used = NOW() WHERE id = ?', [passwordId]);
    return entry;
  }

  async update(userId, passwordId, data) {
    await this.getById(userId, passwordId);

    const fields = [];
    const values = [];
    if (data.siteName) { fields.push('site_name = ?'); values.push(data.siteName); }
    if (data.siteUrl) { fields.push('site_url = ?'); values.push(data.siteUrl); }
    if (data.username) { fields.push('site_username = ?'); values.push(data.username); }
    if (data.password) {
      fields.push('encrypted_password = ?');
      values.push(encrypt(data.password));
    }
    if (data.category) { fields.push('category = ?'); values.push(data.category); }
    if (data.notes !== undefined) { fields.push('notes = ?'); values.push(data.notes); }

    if (fields.length === 0) throw new AppError('No fields to update', 400);

    values.push(passwordId);
    await pool.query(`UPDATE passwords SET ${fields.join(', ')} WHERE id = ?`, values);

    return this.getById(userId, passwordId);
  }

  async delete(userId, passwordId) {
    await this.getById(userId, passwordId);
    await pool.query('DELETE FROM passwords WHERE id = ? AND user_id = ?', [passwordId, userId]);
  }

  async getCategories(userId) {
    const [rows] = await pool.query(
      'SELECT DISTINCT category FROM passwords WHERE user_id = ? ORDER BY category',
      [userId]
    );
    return rows.map(r => r.category);
  }

  async getDashboardStats(userId) {
    const [totalPasswords] = await pool.query(
      'SELECT COUNT(*) as total FROM passwords WHERE user_id = ?', [userId]
    );
    const [categoryCounts] = await pool.query(
      'SELECT category, COUNT(*) as count FROM passwords WHERE user_id = ? GROUP BY category', [userId]
    );
    const [recent] = await pool.query(
      'SELECT id, site_name, site_url, site_username, category, created_at FROM passwords WHERE user_id = ? ORDER BY created_at DESC LIMIT 5', [userId]
    );

    return {
      totalPasswords: totalPasswords[0].total,
      categories: categoryCounts,
      recentPasswords: recent,
    };
  }

  async getAdminStats() {
    const [[{ totalUsers }]] = await pool.query('SELECT COUNT(*) as totalUsers FROM users');
    const [[{ totalPasswords }]] = await pool.query('SELECT COUNT(*) as totalPasswords FROM passwords');
    const [[{ activeToday }]] = await pool.query(
      'SELECT COUNT(*) as activeToday FROM users WHERE DATE(last_login) = CURDATE()'
    );
    const [recentUsers] = await pool.query(
      'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 5'
    );
    const [categoryDist] = await pool.query(
      'SELECT category, COUNT(*) as count FROM passwords GROUP BY category ORDER BY count DESC'
    );

    return { totalUsers, totalPasswords, activeToday, recentUsers, categoryDistribution: categoryDist };
  }
}

export default new PasswordService();

CREATE DATABASE IF NOT EXISTS password_manager;
USE password_manager;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  avatar_url VARCHAR(500) DEFAULT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_username (username),
  INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Passwords table
CREATE TABLE IF NOT EXISTS passwords (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  site_name VARCHAR(200) NOT NULL,
  site_url VARCHAR(500) DEFAULT NULL,
  site_username VARCHAR(200) NOT NULL,
  encrypted_password TEXT NOT NULL,
  category VARCHAR(100) DEFAULT 'General',
  notes TEXT DEFAULT NULL,
  last_used TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_passwords_user (user_id),
  INDEX idx_passwords_category (user_id, category),
  INDEX idx_passwords_site (user_id, site_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Refresh tokens table
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(500) NOT NULL UNIQUE,
  is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_refresh_token (token),
  INDEX idx_refresh_user (user_id, is_revoked)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin (password: Admin@123)
INSERT INTO users (username, email, password, full_name, role) VALUES
('admin', 'admin@passwordmanager.com', '$2a$12$LJ3m4ys3Lg3YOCwKkBPqZOzXq0HMBs0Y9Y0q0Y0q0Y0q0Y0q0Y0qO', 'Administrator', 'admin')
ON DUPLICATE KEY UPDATE username=username;

-- Insert sample categories
INSERT INTO passwords (user_id, site_name, site_url, site_username, encrypted_password, category, notes) VALUES
(1, 'GitHub', 'https://github.com', 'admin', 'encrypted:demo', 'Development', 'Main GitHub account'),
(1, 'Gmail', 'https://gmail.com', 'admin@gmail.com', 'encrypted:demo', 'Email', 'Personal email'),
(1, 'AWS Console', 'https://aws.amazon.com', 'admin', 'encrypted:demo', 'Cloud', 'AWS root account');

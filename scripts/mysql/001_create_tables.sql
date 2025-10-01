-- Create access_keys table
CREATE TABLE IF NOT EXISTS access_keys (
  id INT AUTO_INCREMENT PRIMARY KEY,
  access_key VARCHAR(255) UNIQUE NOT NULL,
  device_fingerprint VARCHAR(255) DEFAULT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at DATETIME DEFAULT NULL,
  last_used_at DATETIME DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_access_key (access_key),
  INDEX idx_device_fingerprint (device_fingerprint),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

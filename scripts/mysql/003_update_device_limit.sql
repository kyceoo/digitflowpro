-- Update access_keys table to support multiple devices (up to 100 per key)
CREATE TABLE IF NOT EXISTS access_key_devices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  access_key_id INT NOT NULL,
  device_fingerprint VARCHAR(255) NOT NULL,
  device_name VARCHAR(255) DEFAULT NULL,
  first_used_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_used_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (access_key_id) REFERENCES access_keys(id) ON DELETE CASCADE,
  UNIQUE KEY unique_device_per_key (access_key_id, device_fingerprint),
  INDEX idx_access_key_id (access_key_id),
  INDEX idx_device_fingerprint (device_fingerprint)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add device_limit column to access_keys
ALTER TABLE access_keys 
ADD COLUMN device_limit INT DEFAULT 100 AFTER device_fingerprint;

-- Remove device_fingerprint from access_keys as we now use the devices table
ALTER TABLE access_keys 
DROP COLUMN device_fingerprint;

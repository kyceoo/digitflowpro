# Digit Flow Pro - Access Key System Guide

## Overview

Digit Flow Pro uses a secure access key authentication system where each key can only be used on one device. This ensures exclusive access and prevents unauthorized sharing.

## Quick Start

### For Users

1. **Get an Access Key**
   - Contact: **+1 (763) 357-7737**
   - Request an access key for Digit Flow Pro
   - You will receive a unique key like: `DFP-2024-XXXXX-XXXXX`

2. **Login**
   - Visit the Digit Flow Pro login page
   - Enter your access key
   - Click "Access System"
   - Your device will be bound to this key

3. **Important Notes**
   - Each key works on ONE device only
   - Once used, the key is permanently bound to that device
   - Keep your access key secure and private
   - Keys expire after the specified period (usually 6-12 months)

### For Administrators

## Setting Up the Database

1. **Run the SQL Scripts**
   
   Execute these scripts in order:
   \`\`\`bash
   # 1. Create the access_keys table
   scripts/001_create_access_keys_table.sql
   
   # 2. Seed with sample keys (optional)
   scripts/002_seed_access_keys.sql
   \`\`\`

2. **Verify Tables**
   
   Check that the `access_keys` table exists with these columns:
   - `id` (UUID, primary key)
   - `access_key` (text, unique)
   - `is_active` (boolean)
   - `device_id` (text, nullable)
   - `last_used_at` (timestamp)
   - `created_at` (timestamp)
   - `expires_at` (timestamp)

## Creating Access Keys

### Method 1: Admin Panel (Recommended)

1. **Access the Admin Panel**
   - Login to Digit Flow Pro
   - Click the "Admin" button in the top right
   - You'll see the Access Key Management interface

2. **Generate a New Key**
   - Set the expiry period (in months)
   - Click "Generate Key"
   - Copy the generated key
   - Share it securely with the user

3. **Manage Existing Keys**
   - View all keys with their status
   - See which keys are device-bound
   - Deactivate keys if needed
   - Delete keys permanently
   - Check last usage dates

### Method 2: Manual SQL (Advanced)

\`\`\`sql
-- Generate a key manually
INSERT INTO public.access_keys (access_key, is_active, expires_at)
VALUES (
  'DFP-2024-CUSTOM-KEY',
  true,
  NOW() + INTERVAL '12 months'
);
\`\`\`

### Method 3: API Endpoint

\`\`\`bash
# POST request to generate a key
curl -X POST https://your-domain.com/api/admin/access-keys \
  -H "Content-Type: application/json" \
  -d '{"expiryMonths": 12}'
\`\`\`

## Access Key Format

Keys follow this pattern:
\`\`\`
DFP-YYYY-RANDOM-TIMESTAMP
\`\`\`

Example: `DFP-2024-A7B9C2-K8M3N5`

- **DFP**: Digit Flow Pro prefix
- **YYYY**: Year of creation
- **RANDOM**: Random alphanumeric string
- **TIMESTAMP**: Encoded timestamp for uniqueness

## Device Binding

### How It Works

1. User enters access key on login page
2. System generates a unique device fingerprint based on:
   - User agent
   - Screen resolution
   - Timezone
   - Language
   - Platform
   - Color depth
   - Hardware concurrency

3. Device ID is stored with the access key
4. Future logins verify the device ID matches

### Security Features

- **One Device Per Key**: Keys cannot be shared between devices
- **Automatic Binding**: Device is bound on first successful login
- **Persistent Sessions**: Users stay logged in on their device
- **Expiry Dates**: Keys automatically expire after set period
- **Deactivation**: Admins can instantly deactivate compromised keys

## Sample Access Keys (Testing)

The seed script creates these test keys:

\`\`\`
DFP-2024-ALPHA-001  (expires in 1 year)
DFP-2024-ALPHA-002  (expires in 1 year)
DFP-2024-ALPHA-003  (expires in 1 year)
DFP-2024-BETA-001   (expires in 6 months)
DFP-2024-BETA-002   (expires in 6 months)
\`\`\`

**⚠️ Important**: Delete or deactivate these test keys in production!

## API Endpoints

### GET /api/admin/access-keys
Fetch all access keys with their status

**Response:**
\`\`\`json
{
  "keys": [
    {
      "id": "uuid",
      "access_key": "DFP-2024-XXXXX-XXXXX",
      "is_active": true,
      "device_id": "device-fingerprint-hash",
      "last_used_at": "2024-01-15T10:30:00Z",
      "created_at": "2024-01-01T00:00:00Z",
      "expires_at": "2025-01-01T00:00:00Z"
    }
  ]
}
\`\`\`

### POST /api/admin/access-keys
Generate a new access key

**Request:**
\`\`\`json
{
  "expiryMonths": 12
}
\`\`\`

**Response:**
\`\`\`json
{
  "accessKey": "DFP-2024-XXXXX-XXXXX",
  "data": { /* full key object */ }
}
\`\`\`

### PATCH /api/admin/access-keys
Update key status (activate/deactivate)

**Request:**
\`\`\`json
{
  "id": "key-uuid",
  "isActive": false
}
\`\`\`

### DELETE /api/admin/access-keys?id=key-uuid
Permanently delete an access key

## Troubleshooting

### "Invalid or expired access key"
- Check if the key is active in the admin panel
- Verify the key hasn't expired
- Ensure you're typing the key correctly (case-sensitive)

### "This key is already in use on another device"
- The key has been used on a different device
- Contact admin to deactivate and get a new key
- Clear browser data and try again (if same device)

### "Device verification failed"
- Browser fingerprint has changed significantly
- Try clearing cookies and localStorage
- Contact admin for a new key if issue persists

### User can't access admin panel
- Admin panel is accessible to all logged-in users
- Ensure user has successfully logged in with valid key
- Check browser console for errors

## Best Practices

### For Administrators

1. **Key Distribution**
   - Generate keys only when needed
   - Use appropriate expiry periods
   - Keep a record of who received which key
   - Use secure channels to share keys (not email/SMS)

2. **Monitoring**
   - Regularly check the admin panel
   - Review last_used_at dates
   - Deactivate unused keys after 30 days
   - Monitor for suspicious activity

3. **Security**
   - Delete test keys in production
   - Set reasonable expiry dates
   - Deactivate keys immediately if compromised
   - Regularly audit active keys

### For Users

1. **Key Security**
   - Never share your access key
   - Store it securely (password manager)
   - Don't screenshot or write it down
   - Report lost keys immediately

2. **Device Management**
   - Use the same device consistently
   - Don't clear browser data unnecessarily
   - Contact admin if you need to switch devices

## Contact & Support

For access key requests or issues:
- **Phone**: +1 (763) 357-7737
- **System**: Digit Flow Pro Admin Panel

---

**Digit Flow Pro** - Professional Market Analysis System

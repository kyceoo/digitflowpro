# MySQL Setup Guide for Digit Flow Pro

## Environment Variables

Add these environment variables to your Vercel project or `.env.local` file:

\`\`\`env
MYSQL_HOST=your-mysql-host.com
MYSQL_PORT=3306
MYSQL_USER=your-username
MYSQL_PASSWORD=your-password
MYSQL_DATABASE=digitflowpro
\`\`\`

## Database Setup

### Option 1: Using MySQL Workbench or phpMyAdmin

1. Create a new database named `digitflowpro`
2. Run the SQL scripts in order:
   - `scripts/mysql/001_create_tables.sql`
   - `scripts/mysql/002_seed_access_keys.sql`

### Option 2: Using MySQL Command Line

\`\`\`bash
# Connect to MySQL
mysql -u your-username -p

# Create database
CREATE DATABASE digitflowpro;
USE digitflowpro;

# Run the scripts
source scripts/mysql/001_create_tables.sql;
source scripts/mysql/002_seed_access_keys.sql;
\`\`\`

### Option 3: Using a MySQL Client Library

\`\`\`javascript
const mysql = require('mysql2/promise');

async function setup() {
  const connection = await mysql.createConnection({
    host: 'your-host',
    user: 'your-user',
    password: 'your-password'
  });
  
  await connection.query('CREATE DATABASE IF NOT EXISTS digitflowpro');
  await connection.query('USE digitflowpro');
  
  // Run your SQL scripts here
}
\`\`\`

## Popular MySQL Hosting Options

1. **PlanetScale** - Free tier available, serverless MySQL
2. **Railway** - Easy deployment with MySQL
3. **AWS RDS** - Managed MySQL service
4. **DigitalOcean Managed Databases** - Simple MySQL hosting
5. **Aiven** - Free tier with MySQL support

## Testing the Connection

After setting up your database and environment variables, test the connection:

\`\`\`bash
npm run dev
\`\`\`

Visit `/admin` to verify the access key management system is working with MySQL.

## Sample Access Keys

The seed script creates these test access keys:
- `DFP-2024-ALPHA-001`
- `DFP-2024-ALPHA-002`
- `DFP-2024-ALPHA-003`
- `DFP-2024-BETA-001`
- `DFP-2024-BETA-002`

All keys are valid for 6-12 months from creation.

# Digit Flow Pro

A professional market analysis system for Binary.com/Deriv trading with advanced pattern recognition, real-time signal generation, and comprehensive digit analysis.

## Features

### 🔐 Secure Access System
- Access key authentication
- One key per device binding
- Device fingerprinting
- Session management
- Admin panel for key management

### 📊 Market Analysis
- Real-time tick data from 10 volatility indices
- Pattern recognition and prediction
- Match/Differ tracking
- Statistical analysis
- Digit frequency analysis

### 🎯 Signal Generation
- 60-second comprehensive market analysis
- Multi-market comparison
- Confidence scoring
- Rise/Fall and Even/Odd predictions
- Most appearing digit tracking

### 📈 Visualization
- Live tick line charts with color coding
- Digit frequency bar charts
- Real-time statistics dashboard
- Pattern analysis display
- Signal centre with top opportunities

### 📱 Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interface
- Adaptive layouts

## Getting Started

### Prerequisites

- Node.js 18+ 
- Supabase account
- Vercel account (for deployment)

### Installation

1. **Clone and Install**
   \`\`\`bash
   npm install
   # or
   pnpm install
   \`\`\`

2. **Set Up Database**
   
   Run the SQL scripts in order:
   - `scripts/001_create_access_keys_table.sql`
   - `scripts/002_seed_access_keys.sql`

3. **Configure Environment**
   
   Ensure these Supabase environment variables are set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

4. **Run Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Access the Application**
   - Login: `http://localhost:3000/login`
   - Admin: `http://localhost:3000/admin`
   - Main App: `http://localhost:3000`

### First Time Setup

1. Run the database scripts
2. Access `/admin` to generate access keys
3. Use a generated key to login
4. Start analyzing markets!

## Usage

### For Users

1. **Login**
   - Enter your access key
   - System binds to your device
   - Access the analysis dashboard

2. **Generate Signals**
   - Click "Generate Trading Signal"
   - Wait 60 seconds for analysis
   - Review top trading opportunities
   - Check matches, differs, and confidence scores

3. **Analyze Markets**
   - Select a volatility index
   - Start analysis
   - Monitor patterns and predictions
   - Track matches and statistics

### For Administrators

1. **Access Admin Panel**
   - Login with any valid key
   - Click "Admin" button
   - Manage all access keys

2. **Generate Keys**
   - Set expiry period
   - Click "Generate Key"
   - Copy and share securely

3. **Monitor Usage**
   - View active keys
   - Check device bindings
   - Review last usage dates
   - Deactivate or delete keys

## Project Structure

\`\`\`
digit-flow-pro/
├── app/
│   ├── page.tsx              # Main analysis dashboard
│   ├── login/page.tsx        # Login page
│   ├── admin/page.tsx        # Admin panel
│   └── api/
│       ├── auth/             # Authentication endpoints
│       └── admin/            # Admin API routes
├── components/
│   ├── signal-analysis-dialog.tsx
│   ├── signal-centre.tsx
│   ├── digit-display.tsx
│   ├── tick-line-chart.tsx
│   └── ...
├── lib/
│   ├── supabase/             # Supabase clients
│   ├── signal-analysis.ts    # Signal generation logic
│   ├── analysis.ts           # Pattern analysis
│   └── device-fingerprint.ts # Device binding
├── hooks/
│   └── use-tick-data.ts      # Real-time data hook
└── scripts/
    ├── 001_create_access_keys_table.sql
    └── 002_seed_access_keys.sql
\`\`\`

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Charts**: Recharts
- **Authentication**: Custom access key system
- **Deployment**: Vercel

## Security Features

- Device fingerprinting
- One key per device enforcement
- Session management
- Secure cookie handling
- Access key expiry
- Admin controls

## Support

For access keys or technical support:
- **Phone**: +1 (763) 357-7737
- **Admin Panel**: Manage keys and users

## License

Proprietary - Digit Flow Pro

---

**Built with ❤️ for professional traders**

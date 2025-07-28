# Authentication Setup Guide

This guide will help you set up Google OAuth authentication for StackIt.

## 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/stackit"
```

## 2. Google OAuth Setup

### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API

### Step 2: Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
5. Copy the Client ID and Client Secret

### Step 3: Update Environment Variables
Replace the placeholder values in `.env.local` with your actual Google OAuth credentials.

## 3. Database Setup

### Step 1: Set up PostgreSQL
1. Install PostgreSQL on your system
2. Create a new database named `stackit`

### Step 2: Run Prisma Migrations
```bash
# Install dependencies
bun install

# Generate Prisma client
bunx prisma generate

# Run database migrations
bunx prisma db push

# (Optional) View your database
bunx prisma studio
```

## 4. Generate NextAuth Secret

Generate a secure random string for NEXTAUTH_SECRET:

```bash
# On macOS/Linux
openssl rand -base64 32

# On Windows PowerShell
[System.Web.Security.Membership]::GeneratePassword(32, 10)
```

## 5. Start the Development Server

```bash
bun dev
```

## Features Implemented

✅ **Google OAuth Authentication**
- Users can sign in with their Google account
- Automatic account creation on first sign-in
- Secure session management

✅ **Protected Routes**
- `/ask-a-question` requires authentication
- Unauthenticated users are redirected to sign-in page
- Guest users can still browse questions at `/browse`

✅ **User Interface**
- Navigation bar with authentication status
- Sign in/out buttons
- User profile display
- Responsive design

✅ **Database Integration**
- Prisma schema with NextAuth.js tables
- User accounts and sessions storage
- PostgreSQL database support

## Security Features

- JWT-based session management
- Secure OAuth 2.0 flow
- Environment variable protection
- CSRF protection via NextAuth.js
- Automatic session validation

## Next Steps

1. Set up your Google OAuth credentials
2. Configure your database connection
3. Update the environment variables
4. Run the database migrations
5. Start the development server

The authentication system is now fully functional with Google OAuth integration! 
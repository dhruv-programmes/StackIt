# Database Setup Guide

This guide explains how to migrate from JSON file storage to a proper Prisma database.

## 🗄️ Database Migration

### 1. Update Prisma Schema
The Prisma schema has been updated to include:
- **User model** with authentication fields
- **Question model** with proper relationships
- **Comment model** with cascade deletion
- **Removed views** field as requested

### 2. Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Migrate existing data from JSON files
npm run db:migrate
```

### 3. Database Schema

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  questions     Question[]
  comments      Comment[]
}

model Question {
  id          String    @id @default(cuid())
  title       String
  description String
  tags        String    // JSON string
  authorId    String
  author      User      @relation(fields: [authorId], references: [id])
  createdAt   DateTime  @default(now())
  votes       Int       @default(0)
  comments    Comment[]
}

model Comment {
  id         String   @id @default(cuid())
  content    String
  authorId   String
  author     User     @relation(fields: [authorId], references: [id])
  questionId String
  question   Question @relation(fields: [questionId], references: [id], onDelete: Cascade)
  createdAt  DateTime @default(now())
  votes      Int      @default(0)
}
```

## 🔄 API Changes

### Updated API Routes
- **`/api/questions`** - Now uses Prisma for CRUD operations
- **`/api/questions/[id]`** - Individual question operations
- **`/api/questions/[id]/comments`** - Comment operations

### Key Improvements
- ✅ **Proper database relationships** with foreign keys
- ✅ **Cascade deletion** - Comments are deleted when questions are deleted
- ✅ **User management** - Proper user creation and updates
- ✅ **Data integrity** - No more JSON file corruption risks
- ✅ **Scalability** - Can handle large amounts of data
- ✅ **Performance** - Optimized database queries

## 🚀 Benefits of Prisma Database

1. **Data Integrity**: Foreign key constraints ensure data consistency
2. **Performance**: Indexed queries are much faster than JSON file reads
3. **Scalability**: Can handle thousands of questions and comments
4. **Reliability**: No risk of JSON file corruption
5. **Type Safety**: Full TypeScript support with Prisma client
6. **Migrations**: Easy schema updates and data migrations

## 📊 Data Migration

The migration script (`scripts/migrate-data.js`) will:
1. Read existing questions from `data/questions.json`
2. Create users in the database
3. Create questions with proper relationships
4. Create comments with proper relationships
5. Preserve all existing data and timestamps

## 🔧 Environment Variables

Make sure your `.env` file includes:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 🎯 Next Steps

After running the migration:

1. **Test the application** - Verify all features work correctly
2. **Remove JSON files** - Delete `data/questions.json` after confirming migration
3. **Update documentation** - Remove references to JSON file storage
4. **Monitor performance** - Database queries should be much faster

The application now uses a proper database with Prisma, providing better performance, reliability, and scalability! 
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createTables() {
  try {
    console.log('🔄 Creating database tables...')
    
    // Test connection
    await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Database connection successful')
    
    // Create User table
    await prisma.$queryRaw`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL,
        "name" TEXT,
        "email" TEXT,
        "emailVerified" TIMESTAMP,
        "image" TEXT,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
      )
    `
    console.log('✅ User table created')
    
    // Create Question table
    await prisma.$queryRaw`
      CREATE TABLE IF NOT EXISTS "Question" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "tags" TEXT NOT NULL,
        "authorId" TEXT NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "votes" INTEGER NOT NULL DEFAULT 0,
        CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
      )
    `
    console.log('✅ Question table created')
    
    // Create Comment table
    await prisma.$queryRaw`
      CREATE TABLE IF NOT EXISTS "Comment" (
        "id" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "authorId" TEXT NOT NULL,
        "questionId" TEXT NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "votes" INTEGER NOT NULL DEFAULT 0,
        CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
      )
    `
    console.log('✅ Comment table created')
    
    // Create Vote table
    await prisma.$queryRaw`
      CREATE TABLE IF NOT EXISTS "Vote" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "questionId" TEXT,
        "commentId" TEXT,
        "voteType" TEXT NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
      )
    `
    console.log('✅ Vote table created')
    
    console.log('✅ All tables created successfully!')
    
  } catch (error) {
    console.error('❌ Error creating tables:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTables() 
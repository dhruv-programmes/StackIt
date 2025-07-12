import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST() {
  try {
    console.log('🔄 Setting up database...')
    
    // Test database connection
    await prisma.$executeRaw`SELECT 1`
    console.log('✅ Database connection successful')
    
    // Create tables using PostgreSQL syntax
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL,
        "name" TEXT,
        "email" TEXT,
        "emailVerified" TIMESTAMP,
        "image" TEXT,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
      )
    `
    console.log('✅ User table created/verified')
    
    await prisma.$executeRaw`
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
    console.log('✅ Question table created/verified')
    
    await prisma.$executeRaw`
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
    console.log('✅ Comment table created/verified')
    
    await prisma.$executeRaw`
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
    console.log('✅ Vote table created/verified')
    
    // Add foreign key constraints
    try {
      await prisma.$executeRaw`
        ALTER TABLE "Question" 
        ADD CONSTRAINT "Question_authorId_fkey" 
        FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE
      `
      console.log('✅ Question foreign key added')
    } catch (e) {
      console.log('⚠️ Question foreign key already exists')
    }
    
    try {
      await prisma.$executeRaw`
        ALTER TABLE "Comment" 
        ADD CONSTRAINT "Comment_authorId_fkey" 
        FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE
      `
      console.log('✅ Comment author foreign key added')
    } catch (e) {
      console.log('⚠️ Comment author foreign key already exists')
    }
    
    try {
      await prisma.$executeRaw`
        ALTER TABLE "Comment" 
        ADD CONSTRAINT "Comment_questionId_fkey" 
        FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE
      `
      console.log('✅ Comment question foreign key added')
    } catch (e) {
      console.log('⚠️ Comment question foreign key already exists')
    }
    
    console.log('✅ Database setup completed successfully')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database setup completed successfully'
    })
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database setup failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 
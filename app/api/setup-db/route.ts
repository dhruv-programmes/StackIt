import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST() {
  try {
    console.log('🔄 Setting up database...')
    
    // Test database connection with a simple query
    await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Database connection successful')
    
    // Use $queryRaw instead of $executeRaw to avoid prepared statement conflicts
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
    console.log('✅ User table created/verified')
    
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
    console.log('✅ Question table created/verified')
    
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
    console.log('✅ Comment table created/verified')
    
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
    console.log('✅ Vote table created/verified')
    
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
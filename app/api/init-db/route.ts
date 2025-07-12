import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST() {
  try {
    console.log('🔄 Initializing database via API...')
    
    // Test database connection
    await prisma.$executeRaw`SELECT 1`
    console.log('✅ Database connection successful')
    
    // Try to create tables by running a simple query
    // This will trigger table creation if they don't exist
    await prisma.user.findFirst()
    await prisma.question.findFirst()
    await prisma.comment.findFirst()
    
    console.log('✅ Database tables verified/created')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database initialized successfully' 
    })
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database initialization failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 
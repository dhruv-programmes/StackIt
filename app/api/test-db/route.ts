import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Try to query the database
    const userCount = await prisma.user.count()
    
    return NextResponse.json({ 
      success: true, 
      message: "Database connection successful",
      userCount 
    })
  } catch (error: any) {
    console.error("Database connection test failed:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Database connection failed",
      details: error.message 
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 
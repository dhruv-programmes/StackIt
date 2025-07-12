import { NextResponse } from "next/server"
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST() {
  try {
    console.log('🔄 Setting up database...')
    
    // Run prisma db push to create tables
    const { stdout, stderr } = await execAsync('npx prisma db push --accept-data-loss')
    
    console.log('✅ Database setup output:', stdout)
    if (stderr) {
      console.warn('⚠️ Database setup warnings:', stderr)
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database setup completed successfully',
      output: stdout
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
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import fs from 'fs'
import path from 'path'

const dataFile = path.join(process.cwd(), 'data', 'questions.json')

// Ensure data directory exists
const dataDir = path.dirname(dataFile)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Initialize empty data file if it doesn't exist
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify([]))
}

function readQuestions() {
  try {
    const data = fs.readFileSync(dataFile, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading questions:', error)
    return []
  }
}

function writeQuestions(questions: any[]) {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(questions, null, 2))
  } catch (error) {
    console.error('Error writing questions:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description, tags } = await request.json()

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 })
    }

    const questions = readQuestions()
    
    const newQuestion = {
      id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      tags: tags || [],
      authorId: session.user.id,
      author: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      },
      createdAt: new Date().toISOString(),
      votes: 0,
      comments: []
    }

    questions.unshift(newQuestion)
    writeQuestions(questions)

    return NextResponse.json(newQuestion)
  } catch (error) {
    console.error("Error creating question:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const questions = readQuestions()
    
    // Sort by creation date (newest first)
    const sortedQuestions = questions.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return NextResponse.json(sortedQuestions)
  } catch (error) {
    console.error("Error fetching questions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import fs from 'fs'
import path from 'path'

const dataFile = path.join(process.cwd(), 'data', 'questions.json')

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
    // Extract params from the URL
    const urlParts = request.nextUrl.pathname.split("/");
    const id = urlParts[3]; // /api/questions/[id]/comments
    
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { content } = await request.json()

    if (!content?.trim()) {
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 })
    }

    const questions = readQuestions()
    const questionIndex = questions.findIndex((q: any) => q.id === id)

    if (questionIndex === -1) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 })
    }

    const question = questions[questionIndex]
    
    // Create new comment
    const newComment = {
      id: `c_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: content.trim(),
      authorId: session.user.id,
      author: {
        name: session.user.name,
        image: session.user.image,
      },
      createdAt: new Date().toISOString(),
      votes: 0,
      replies: []
    }

    // Add comment to question
    if (!question.comments) {
      question.comments = []
    }
    question.comments.push(newComment)
    
    // Update the question in the array
    questions[questionIndex] = question
    writeQuestions(questions)

    return NextResponse.json(question)
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 
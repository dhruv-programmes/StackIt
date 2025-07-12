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
    const id = urlParts[3]; // /api/questions/[id]/vote
    
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { voteType } = await request.json()

    if (!voteType || !['UP', 'DOWN'].includes(voteType)) {
      return NextResponse.json({ error: "Invalid vote type" }, { status: 400 })
    }

    const questions = readQuestions()
    const questionIndex = questions.findIndex((q: any) => q.id === id)

    if (questionIndex === -1) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 })
    }

    const question = questions[questionIndex]
    
    // Update vote count
    const voteChange = voteType === 'UP' ? 1 : -1
    question.votes = (question.votes || 0) + voteChange
    
    // Update the question in the array
    questions[questionIndex] = question
    writeQuestions(questions)

    return NextResponse.json(question)
  } catch (error) {
    console.error("Error voting on question:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 
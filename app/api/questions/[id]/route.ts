import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import fs from 'fs'
import path from 'path'

const dataFile = path.join(process.cwd(), 'data', 'questions.json')

function readQuestions() {
  try {
    // Check if file exists
    if (!fs.existsSync(dataFile)) {
      console.log('Questions file does not exist, creating empty file')
      fs.writeFileSync(dataFile, JSON.stringify([]))
      return []
    }
    
    const data = fs.readFileSync(dataFile, 'utf8')
    
    // Check if file is empty
    if (!data.trim()) {
      console.log('Questions file is empty, initializing with empty array')
      fs.writeFileSync(dataFile, JSON.stringify([]))
      return []
    }
    
    const parsed = JSON.parse(data)
    
    // Ensure it's an array
    if (!Array.isArray(parsed)) {
      console.log('Questions file is not an array, initializing with empty array')
      fs.writeFileSync(dataFile, JSON.stringify([]))
      return []
    }
    
    return parsed
  } catch (error) {
    console.error('Error reading questions:', error)
    // If there's any error, create a fresh file
    try {
      fs.writeFileSync(dataFile, JSON.stringify([]))
    } catch (writeError) {
      console.error('Error creating questions file:', writeError)
    }
    return []
  }
}

export async function GET(request: NextRequest) {
  try {
    // Extract params from the URL
    const urlParts = request.nextUrl.pathname.split("/");
    const id = urlParts[3]; // /api/questions/[id]
    
    const questions = readQuestions()
    const question = questions.find((q: any) => q.id === id)

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 })
    }

    return NextResponse.json(question)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch question" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Extract params from the URL
    const urlParts = request.nextUrl.pathname.split("/");
    const id = urlParts[3]; // /api/questions/[id]
    
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const questions = readQuestions()
    const questionIndex = questions.findIndex((q: any) => q.id === id)

    if (questionIndex === -1) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 })
    }
    
    const question = questions[questionIndex]
    
    // Check if the current user is the author of the question
    if (question.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only delete your own questions" },
        { status: 403 }
      )
    }

    // Remove the question from the array
    questions.splice(questionIndex, 1)
    
    // Write back to file
    const fs = require('fs')
    fs.writeFileSync(dataFile, JSON.stringify(questions, null, 2))

    return NextResponse.json({ message: "Question deleted successfully" })
  } catch (error) {
    console.error("Error deleting question:", error)
    return NextResponse.json(
      { error: "Failed to delete question" },
      { status: 500 }
    )
  }
} 
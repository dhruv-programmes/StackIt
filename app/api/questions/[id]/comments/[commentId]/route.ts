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

function writeQuestions(questions: any[]) {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(questions, null, 2))
  } catch (error) {
    console.error('Error writing questions:', error)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Extract params from the URL
    const urlParts = request.nextUrl.pathname.split("/");
    const id = urlParts[3];
    const commentId = urlParts[5];
    
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const questions = readQuestions()
    const questionIndex = questions.findIndex((q: any) => q.id === id)

    if (questionIndex === -1) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 })
    }

    const question = questions[questionIndex]
    
    if (!question.comments) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    const commentIndex = question.comments.findIndex((c: any) => c.id === commentId)

    if (commentIndex === -1) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    const comment = question.comments[commentIndex]
    
    // Check if the current user is the author of the comment
    if (comment.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only delete your own comments" },
        { status: 403 }
      )
    }

    // Remove the comment from the array
    question.comments.splice(commentIndex, 1)
    
    // Update the question in the array
    questions[questionIndex] = question
    writeQuestions(questions)

    return NextResponse.json(question)
  } catch (error) {
    console.error("Error deleting comment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 
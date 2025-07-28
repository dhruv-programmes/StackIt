import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

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

    // Create or find user
    const user = await prisma.user.upsert({
      where: { email: session.user.email || undefined },
      update: {
        id: session.user.id,
        name: session.user.name,
        image: session.user.image,
      },
      create: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email || undefined,
        image: session.user.image,
      },
    })

    const newQuestion = await prisma.question.create({
      data: {
        title,
        description,
        tags: JSON.stringify(tags || []),
        authorId: user.id,
      },
      include: {
        author: true,
        comments: {
          include: {
            author: true,
          },
        },
      },
    })

    // Transform the response to match the expected format
    const transformedQuestion = {
      ...newQuestion,
      tags: JSON.parse(newQuestion.tags),
      author: {
        id: newQuestion.author.id,
        name: newQuestion.author.name,
        image: newQuestion.author.image,
      },
      comments: newQuestion.comments.map((comment: any) => ({
        id: comment.id,
        content: comment.content,
        author: {
          name: comment.author.name,
          image: comment.author.image,
        },
        createdAt: comment.createdAt.toISOString(),
        votes: comment.votes,
        replies: [],
      })),
      createdAt: newQuestion.createdAt.toISOString(),
    }

    return NextResponse.json(transformedQuestion)
  } catch (error: any) {
    console.error("Error creating question:", error)
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error.message 
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      include: {
        author: true,
        comments: {
          include: {
            author: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Transform the response to match the expected format
    const transformedQuestions = questions.map((question: any) => ({
      ...question,
      tags: JSON.parse(question.tags),
      author: {
        id: question.author.id,
        name: question.author.name,
        image: question.author.image,
      },
      comments: question.comments.map((comment: any) => ({
        id: comment.id,
        content: comment.content,
        author: {
          name: comment.author.name,
          image: comment.author.image,
        },
        createdAt: comment.createdAt.toISOString(),
        votes: comment.votes,
        replies: [],
      })),
      createdAt: question.createdAt.toISOString(),
    }))

    return NextResponse.json(transformedQuestions)
  } catch (error: any) {
    console.error("Error fetching questions:", error)
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error.message 
    }, { status: 500 })
  }
} 
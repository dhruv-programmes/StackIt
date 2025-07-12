import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { content } = await request.json()

    if (!content?.trim()) {
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 })
    }

    // Create or find user
    const user = await prisma.user.upsert({
      where: { id: session.user.id },
      update: {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      },
      create: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      },
    })

    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        authorId: user.id,
        questionId: params.id,
      },
      include: {
        author: true,
      },
    })

    // Fetch the updated question with all comments
    const updatedQuestion = await prisma.question.findUnique({
      where: { id: params.id },
      include: {
        author: true,
        comments: {
          include: {
            author: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    })

    if (!updatedQuestion) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 })
    }

    // Transform the response to match the expected format
    const transformedQuestion = {
      ...updatedQuestion,
      tags: JSON.parse(updatedQuestion.tags),
      author: {
        id: updatedQuestion.author.id,
        name: updatedQuestion.author.name,
        image: updatedQuestion.author.image,
      },
      comments: updatedQuestion.comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        author: {
          name: comment.author.name,
          image: comment.author.image,
        },
        authorId: comment.authorId,
        createdAt: comment.createdAt.toISOString(),
        votes: comment.votes,
        replies: [],
      })),
      createdAt: updatedQuestion.createdAt.toISOString(),
    }

    return NextResponse.json(transformedQuestion)
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

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

    // Create or find user
    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: {
        id: session.user.id,
        name: session.user.name,
        image: session.user.image,
      },
      create: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      },
    })

    // Check if question exists
    const question = await prisma.question.findUnique({
      where: { id },
    })

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 })
    }

    // For now, just update the vote count directly
    // In a full implementation, you'd track individual user votes
    const voteChange = voteType === 'UP' ? 1 : -1
    
    // Update question vote count
    await prisma.question.update({
      where: { id },
      data: {
        votes: {
          increment: voteChange,
        },
      },
    })

    // Get updated question with vote count
    const updatedQuestion = await prisma.question.findUnique({
      where: { id },
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
      return NextResponse.json({ error: "Failed to update question" }, { status: 500 })
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
      comments: updatedQuestion.comments.map((comment: any) => ({
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
      createdAt: updatedQuestion.createdAt.toISOString(),
    }

    return NextResponse.json(transformedQuestion)
  } catch (error) {
    console.error("Error voting on question:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 
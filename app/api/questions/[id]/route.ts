import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    // Extract params from the URL
    const urlParts = request.nextUrl.pathname.split("/");
    const id = urlParts[3]; // /api/questions/[id]
    
    const question = await prisma.question.findUnique({
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

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 })
    }

    // Transform the response to match the expected format
    const transformedQuestion = {
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
        authorId: comment.authorId,
        createdAt: comment.createdAt.toISOString(),
        votes: comment.votes,
        replies: [],
      })),
      createdAt: question.createdAt.toISOString(),
    }

    return NextResponse.json(transformedQuestion)
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

    const question = await prisma.question.findUnique({
      where: { id },
      include: { author: true },
    })

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 })
    }
    
    // Check if the current user is the author of the question
    if (question.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only delete your own questions" },
        { status: 403 }
      )
    }

    // Delete the question (comments will be deleted automatically due to cascade)
    await prisma.question.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Question deleted successfully" })
  } catch (error) {
    console.error("Error deleting question:", error)
    return NextResponse.json(
      { error: "Failed to delete question" },
      { status: 500 }
    )
  }
} 
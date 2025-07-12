import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const comment = await prisma.comment.findUnique({
      where: { id: params.commentId },
      include: { author: true },
    })

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }
    
    // Check if the current user is the author of the comment
    if (comment.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only delete your own comments" },
        { status: 403 }
      )
    }

    // Delete the comment
    await prisma.comment.delete({
      where: { id: params.commentId },
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
    console.error("Error deleting comment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 
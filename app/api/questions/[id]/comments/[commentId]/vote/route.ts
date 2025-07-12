import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { voteType } = await request.json()

    if (!voteType || !['UP', 'DOWN'].includes(voteType)) {
      return NextResponse.json({ error: "Invalid vote type" }, { status: 400 })
    }

    // Check if comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: params.commentId },
    })

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    // Simple vote update - just increment/decrement the vote count
    const voteChange = voteType === 'UP' ? 1 : -1
    
    const updatedComment = await prisma.comment.update({
      where: { id: params.commentId },
      data: {
        votes: {
          increment: voteChange,
        },
      },
      include: {
        author: true,
      },
    })

    return NextResponse.json({
      id: updatedComment.id,
      content: updatedComment.content,
      author: {
        name: updatedComment.author.name,
        image: updatedComment.author.image,
      },
      authorId: updatedComment.authorId,
      createdAt: updatedComment.createdAt.toISOString(),
      votes: updatedComment.votes,
      replies: [],
    })
  } catch (error) {
    console.error("Error voting on comment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 
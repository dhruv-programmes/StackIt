import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Extract params from the URL
    const urlParts = request.nextUrl.pathname.split("/");
    const id = urlParts[3];
    const commentId = urlParts[5];
    
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { voteType } = await request.json()

    if (!voteType || !['UP', 'DOWN'].includes(voteType)) {
      return NextResponse.json({ error: "Invalid vote type" }, { status: 400 })
    }

    // Check if comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    })

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    // Simple vote update - just increment/decrement the vote count
    const voteChange = voteType === 'UP' ? 1 : -1
    
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
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
    return NextResponse.json({ error: "Internal server error", details: (error as any).message }, { status: 500 });
  }
} 
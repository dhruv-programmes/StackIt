import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { marked } from "marked";

export async function POST(request: NextRequest) {
  try {
    // Extract params from the URL
    const urlParts = request.nextUrl.pathname.split("/");
    const id = urlParts[3]; // /api/questions/[id]/comments
    
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

    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        authorId: user.id,
        questionId: id,
      },
      include: {
        author: true,
      },
    })

    // Fetch the updated question with all comments
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
      comments: updatedQuestion.comments.map((comment: any) => ({
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
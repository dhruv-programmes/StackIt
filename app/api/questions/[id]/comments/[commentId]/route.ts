import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  // Extract params from the URL
  const urlParts = request.nextUrl.pathname.split("/");
  // Example: /api/questions/[id]/comments/[commentId]/route.ts
  // urlParts: ["", "api", "questions", "{id}", "comments", "{commentId}"]
  const id = urlParts[3];
  const commentId = urlParts[5];

  // You can now use id and commentId as needed
  return NextResponse.json({ ok: true, id, commentId });
} 
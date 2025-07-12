import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string; commentId: string } }
) {
  // Try to extract params from the URL
  const url = request.nextUrl;
  const id = url.pathname.split("/")[4]; // /api/questions/[id]/comments/[commentId]
  const commentId = url.pathname.split("/")[6];
  return NextResponse.json({ ok: true, id, commentId });
} 
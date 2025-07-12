import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string; commentId: string } }
) {
  return NextResponse.json({ ok: true, params: context.params });
} 
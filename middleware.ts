import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // TEMP: Allow all requests through for debugging
  return NextResponse.next();
}

export const config = {
  matcher: ["/ask-a-question"],
};

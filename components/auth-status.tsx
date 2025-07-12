"use client"

import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { User, LogOut } from "lucide-react"
import Link from "next/link"

export function AuthStatus() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400 mx-auto mb-2"></div>
        <p className="text-slate-400 text-sm">Loading...</p>
      </div>
    )
  }

  if (session) {
    return (
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-slate-300">
          <User className="h-5 w-5" />
          <span>Welcome, {session.user?.name}!</span>
        </div>
        <div className="flex gap-2 justify-center">
          <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center space-y-4">
      <p className="text-slate-400">Sign in to ask questions and participate in the community</p>
      <Link href="/auth/signin">
        <Button className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Sign In
        </Button>
      </Link>
    </div>
  )
} 
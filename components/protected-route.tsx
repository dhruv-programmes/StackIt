"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare, Lock } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="mb-6">
              <Lock className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
              <p className="text-slate-400 mb-6">
                You need to be signed in to access this page. Please sign in with your Google account to continue.
              </p>
            </div>
            <Button
              onClick={() => router.push("/auth/signin")}
              className="flex items-center gap-2 mx-auto"
            >
              <MessageSquare className="h-4 w-4" />
              Sign In to Continue
            </Button>
          </div>
        </div>
      )
    )
  }

  return <>{children}</>
} 
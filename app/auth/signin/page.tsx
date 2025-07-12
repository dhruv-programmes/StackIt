"use client"

import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function SignInPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === "authenticated") {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="max-w-md w-full mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="mb-8">
            <MessageSquare className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Welcome to StackIt</h1>
            <p className="text-slate-400">
              Sign in to ask questions, vote, and participate in the community
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 hover:bg-slate-100"
              size="lg"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="text-center">
              <p className="text-sm text-slate-500">
                By signing in, you agree to our{" "}
                <Link href="/terms" className="text-cyan-400 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-cyan-400 hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-800">
            <p className="text-sm text-slate-400">
              Don't have an account?{" "}
              <span className="text-cyan-400">
                Sign in with Google to create one automatically
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 
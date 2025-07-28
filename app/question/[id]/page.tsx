"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MessageSquare, User, Calendar, Trash2, Reply, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { marked } from "marked"

interface Comment {
  id: string
  content: string
  author: {
    name: string | null
    image: string | null
  }
  authorId: string
  createdAt: string
}

interface Question {
  id: string
  title: string
  description: string
  tags: string[]
  author: {
    id: string
    name: string | null
    image: string | null
  }
  createdAt: string
  votes: number
  comments: Comment[]
}

export default function QuestionDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { data: session } = useSession()
  const { id } = use(params)
  const [question, setQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deletingComment, setDeletingComment] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch(`/api/questions/${id}`)
        if (response.ok) {
          const data = await response.json()
          setQuestion(data)
        } else {
          router.push("/browse")
        }
      } catch (error) {
        router.push("/browse")
      } finally {
        setLoading(false)
      }
    }

    fetchQuestion()
  }, [id, router])

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !question) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/questions/${question.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment.trim() }),
      })

      if (response.ok) {
        const updatedQuestion = await response.json()
        setQuestion(updatedQuestion)
        setNewComment("")
      }
    } catch (error) {
      console.error("Error submitting comment:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteQuestion = async () => {
    if (!question || !(session?.user && (session.user as any).id)) return
    if (!confirm("Are you sure you want to delete this question?")) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/questions/${question.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.push("/browse")
      }
    } catch {
      alert("Failed to delete question")
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!question || deletingComment) return
    if (!confirm("Are you sure you want to delete this comment?")) return

    setDeletingComment(commentId)
    try {
      const response = await fetch(`/api/questions/${question.id}/comments/${commentId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        const updatedQuestion = await response.json()
        setQuestion(updatedQuestion)
      }
    } catch {
      alert("Failed to delete comment")
    } finally {
      setDeletingComment(null)
    }
  }

  const renderMarkdown = (text: string) => {
    return marked.parse(text || "")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400">Loading question...</p>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400">Question not found</p>
      </div>
    )
  }

  const userId = (session?.user as any)?.id;
  const isAuthor = userId === question.author.id

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Link href="/browse">
          <Button variant="ghost" className="mb-6 text-slate-400 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-6 mb-8"
        >
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">{question.title}</h1>
            {isAuthor && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteQuestion}
                disabled={deleting}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            )}
          </div>

          <div
            className="text-slate-300 mb-6 prose prose-invert max-w-none break-words overflow-auto"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(question.description) }}
          />

          <div className="flex flex-wrap gap-2 mb-4">
            {question.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm rounded-full bg-slate-800/60 text-slate-300 border border-slate-600/50"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{question.author.name || "Anonymous"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(question.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{question.comments.length} comments</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-semibold text-white">Comments</h2>

          <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full min-h-[100px] bg-slate-800/60 border border-slate-600/50 text-white placeholder:text-slate-400 rounded-lg p-3 resize-none"
            />
            <div className="flex justify-end mt-3">
              <Button
                onClick={handleSubmitComment}
                disabled={submitting || !newComment.trim()}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                {submitting ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {question.comments.length > 0 ? (
              question.comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-900/30 rounded-lg border border-slate-700/30 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                      <User className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-slate-200">
                          {comment.author.name || "Anonymous"}
                          <span className="text-xs text-slate-500 ml-2">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {/* {session?.user?.id === comment.authorId && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteComment(comment.id)}
                            disabled={deletingComment === comment.id}
                            className="text-red-400 hover:text-red-300 p-1 h-auto"
                          >
                            {deletingComment === comment.id ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                          </Button>
                        )} */}
                      </div>
                      <p className="text-slate-300 text-sm">{comment.content}</p>
                      {/* <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
                        <Reply className="h-3 w-3" />
                        Reply
                      </div> */}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

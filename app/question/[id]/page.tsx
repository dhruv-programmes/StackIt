"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ArrowUp, ArrowDown, MessageSquare, User, Calendar, ThumbsUp, ThumbsDown, Reply, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Comment {
  id: string
  content: string
  author: {
    name: string | null
    image: string | null
  }
  authorId: string
  createdAt: string
  votes: number
  replies: Comment[]
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
  const [commentVoting, setCommentVoting] = useState<string | null>(null)
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
        console.error("Error fetching question:", error)
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
        body: JSON.stringify({
          content: newComment.trim(),
        }),
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
    if (!question || !session?.user?.id) return

    if (!confirm("Are you sure you want to delete this question? This action cannot be undone.")) {
      return
    }

    setDeleting(true)
    try {
      const response = await fetch(`/api/questions/${question.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.push("/browse")
      } else {
        const error = await response.json()
        alert(error.error || "Failed to delete question")
      }
    } catch (error) {
      console.error("Error deleting question:", error)
      alert("Failed to delete question")
    } finally {
      setDeleting(false)
    }
  }

  const isAuthor = session?.user?.id === question?.author?.id



  const handleCommentVote = async (commentId: string, type: 'up' | 'down') => {
    if (!question || commentVoting) return

    setCommentVoting(commentId)
    try {
      const response = await fetch(`/api/questions/${question.id}/comments/${commentId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voteType: type.toUpperCase(),
        }),
      })

      if (response.ok) {
        const updatedComment = await response.json()
        // Update the specific comment in the question
        setQuestion(prev => {
          if (!prev) return null
          return {
            ...prev,
            comments: prev.comments.map(comment => 
              comment.id === commentId ? updatedComment : comment
            )
          }
        })
      } else {
        console.error('Failed to vote on comment')
      }
    } catch (error) {
      console.error('Error voting on comment:', error)
    } finally {
      setCommentVoting(null)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!question || deletingComment) return

    if (!confirm("Are you sure you want to delete this comment? This action cannot be undone.")) {
      return
    }

    setDeletingComment(commentId)
    try {
      const response = await fetch(`/api/questions/${question.id}/comments/${commentId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const updatedQuestion = await response.json()
        setQuestion(updatedQuestion)
      } else {
        const error = await response.json()
        alert(error.error || "Failed to delete comment")
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
      alert('Failed to delete comment')
    } finally {
      setDeletingComment(null)
    }
  }

  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyan-400">$1</strong>')
      .replace(/```(\w+)?\n(.*?)```/g, '<pre class="bg-slate-800 p-3 rounded-lg my-2 text-sm overflow-x-auto"><code>$2</code></pre>')
      .replace(/`([^`]+)`/g, '<code class="bg-slate-800 px-2 py-1 rounded text-sm">$1</code>')
      .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-cyan-400/50 pl-4 italic text-slate-300">$1</blockquote>')
      .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
      .replace(/(<li.*<\/li>)/g, '<ul class="list-disc space-y-1">$1</ul>')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading question...</p>
        </div>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400">Question not found</p>
          <Link href="/browse">
            <Button className="mt-4">Back to Browse</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Back Button */}
        <Link href="/browse">
          <Button variant="ghost" className="mb-6 text-slate-400 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse
          </Button>
        </Link>

        {/* Question */}
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
                className="flex items-center gap-2 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            )}
          </div>
          
          <div 
            className="text-slate-300 mb-6 prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(question.description) }}
          />

          {/* Tags */}
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

          {/* Meta Information */}
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
              <span>{question.comments?.length || 0} comments</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-cyan-400 font-medium">{question.votes} votes</span>
            </div>
          </div>
        </motion.div>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-semibold text-white">Comments</h2>

          {/* Add Comment */}
          <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full min-h-[100px] bg-slate-800/60 border border-slate-600/50 text-white placeholder:text-slate-400 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
            <div className="flex justify-end mt-3">
                          <Button
              onClick={handleSubmitComment}
              disabled={submitting || !newComment.trim()}
              className="flex items-center gap-2 cursor-pointer"
            >
              <MessageSquare className="h-4 w-4" />
              {submitting ? "Posting..." : "Post Comment"}
            </Button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {question.comments?.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/30 rounded-lg border border-slate-700/30 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                      <User className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-200">
                          {comment.author.name || "Anonymous"}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {session?.user?.id === comment.authorId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteComment(comment.id)}
                          disabled={deletingComment === comment.id}
                          className="text-red-400 hover:text-red-300 p-1 h-auto cursor-pointer"
                        >
                          {deletingComment === comment.id ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}
                        </Button>
                      )}
                    </div>
                    <p className="text-slate-300 text-sm">{comment.content}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCommentVote(comment.id, 'up')}
                        disabled={commentVoting === comment.id}
                        className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400 p-1 h-auto cursor-pointer"
                      >
                        {commentVoting === comment.id ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                        ) : (
                          <ThumbsUp className="h-3 w-3" />
                        )}
                        <span className="text-sm">{comment.votes}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCommentVote(comment.id, 'down')}
                        disabled={commentVoting === comment.id}
                        className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-400 p-1 h-auto cursor-pointer"
                      >
                        {commentVoting === comment.id ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                        ) : (
                          <ThumbsDown className="h-3 w-3" />
                        )}
                      </Button>
                      <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-300">
                        <Reply className="h-3 w-3" />
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {(!question.comments || question.comments.length === 0) && (
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
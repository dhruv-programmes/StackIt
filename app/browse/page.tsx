"use client";

import { motion, cubicBezier } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowUp, ArrowDown, MessageSquare, User, Calendar, Search, Filter, ChevronDown } from "lucide-react"
import { Pacifico } from "next/font/google"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import Link from "next/link"
import { marked } from "marked";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
})

interface Question {
  id: string
  title: string
  description: string
  votes: number
  tags: string[]
  createdAt: string
  author: {
    name: string | null
    image: string | null
  }
}

type SortOption = "newest" | "oldest" | "most-votes" | "least-votes"

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "most-votes", label: "Most Votes" },
  { value: "least-votes", label: "Least Votes" },
] as const

function GeometricShape({
  className,
  delay = 0,
  size = 120,
  rotate = 0,
  gradient = "from-white/[0.08]",
  shape = "triangle",
}: {
  className?: string
  delay?: number
  size?: number
  rotate?: number
  gradient?: string
  shape?: "triangle" | "diamond" | "hexagon" | "star" | "pentagon"
}) {
  const getShapeClasses = () => {
    switch (shape) {
      case "triangle":
        return "clip-path-triangle"
      case "diamond":
        return "clip-path-diamond transform rotate-45"
      case "hexagon":
        return "clip-path-hexagon"
      case "star":
        return "clip-path-star"
      case "pentagon":
        return "clip-path-pentagon"
      default:
        return "clip-path-triangle"
    }
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.3,
        rotate: rotate - 30,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: rotate,
      }}
      transition={{
        duration: 2.2,
        delay,
        ease: cubicBezier(0.23, 0.86, 0.39, 0.96),
        opacity: { duration: 1.4 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        style={{
          width: size,
          height: size,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0",
            "bg-gradient-to-br to-transparent",
            gradient,
            "border-2 border-white/25 backdrop-blur-[3px]",
            "shadow-[0_12px_40px_0_rgba(255,255,255,0.12)]",
            getShapeClasses(),
          )}
        />
        <div
          className={cn(
            "absolute inset-2",
            "bg-gradient-to-tr from-white/10 to-transparent",
            getShapeClasses(),
          )}
        />
      </motion.div>
    </motion.div>
  )
}

function QuestionCard({ question, index }: { question: Question, index: number }) {
  const [votes, setVotes] = useState(question.votes)
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null)
  const [voting, setVoting] = useState(false)

  const handleVote = async (type: 'up' | 'down') => {
    if (voting) return

    setVoting(true)
    try {
      const response = await fetch(`/api/questions/${question.id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voteType: type.toUpperCase(),
        }),
      })

      if (response.ok) {
        const updatedQuestion = await response.json()
        setVotes(updatedQuestion.votes)
        // For now, just toggle the vote state
        setUserVote(userVote === type ? null : type)
      } else {
        console.error('Failed to vote')
      }
    } catch (error) {
      console.error('Error voting:', error)
    } finally {
      setVoting(false)
    }
  }


  const renderMarkdown = (text: string) => {
    return marked.parse(text || "");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: cubicBezier(0.25, 0.4, 0.25, 1),
      }}
      className="group relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-900/60 p-6 shadow-lg backdrop-blur-sm hover:border-cyan-400/30 transition-all duration-300"
    >
      <div className="flex gap-4">
        {/* Vote Section */}
        <div className="flex flex-col items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleVote('up')}
            disabled={voting}
            className={cn(
              "h-8 w-8 p-0 rounded-full transition-all duration-200",
              userVote === 'up' 
                ? "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30" 
                : "text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10"
            )}
          >
            {voting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
          </Button>
          <span className={cn(
            "text-sm font-medium transition-colors",
            votes > 0 ? "text-cyan-400" : "text-slate-400"
          )}>
            {votes}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleVote('down')}
            disabled={voting}
            className={cn(
              "h-8 w-8 p-0 rounded-full transition-all duration-200",
              userVote === 'down' 
                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" 
                : "text-slate-400 hover:text-red-400 hover:bg-red-500/10"
            )}
          >
            {voting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          <Link href={`/question/${question.id}`}>
            <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors cursor-pointer">
              {question.title}
            </h3>
          </Link>
          
          <div 
            className="mt-3 text-slate-300 text-sm leading-relaxed break-words overflow-auto line-clamp-5"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(question.description) }}
          />

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {question.tags.map((tag: string, tagIndex: number) => (
              <span
                key={`${tag}-${tagIndex}`}
                className="px-2 py-1 text-xs rounded-full bg-slate-800/60 text-slate-300 border border-slate-600/50"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Meta Information */}
          <div className="flex items-center gap-4 mt-4 text-xs text-slate-400">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{question.author.name || "Anonymous"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(question.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function BrowseQuestions() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([])
  const [displayedQuestions, setDisplayedQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [page, setPage] = useState(1)
  const questionsPerPage = 10

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.sort-dropdown')) {
        setShowSortDropdown(false)
      }
    }

    if (showSortDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSortDropdown])

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("/api/questions")
        if (response.ok) {
          const data = await response.json()
          setQuestions(data)
          setFilteredQuestions(data)
        }
      } catch (error) {
        console.error("Error fetching questions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  // Filter and sort questions
  useEffect(() => {
    let filtered = questions

    // Apply search filter
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase()
      filtered = questions.filter(
        (question) =>
          question.title.toLowerCase().includes(query) ||
          question.description.toLowerCase().includes(query) ||
          question.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          question.author.name?.toLowerCase().includes(query)
      )
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "most-votes":
          return b.votes - a.votes
        case "least-votes":
          return a.votes - b.votes
        default:
          return 0
      }
    })

    setFilteredQuestions(sorted)
    setPage(1) // Reset page when filters change
  }, [questions, debouncedSearchQuery, sortBy])

  // Update displayed questions based on current page
  useEffect(() => {
    const startIndex = 0
    const endIndex = page * questionsPerPage
    setDisplayedQuestions(filteredQuestions.slice(startIndex, endIndex))
  }, [filteredQuestions, page])

  const loadMoreQuestions = () => {
    setLoadingMore(true)
    // Simulate loading delay
    setTimeout(() => {
      setPage(prev => prev + 1)
      setLoadingMore(false)
    }, 500)
  }

  const hasMoreQuestions = displayedQuestions.length < filteredQuestions.length

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.3 + i * 0.1,
        ease: cubicBezier(0.25, 0.4, 0.25, 1),
      },
    }),
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading questions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-teal-500/10 blur-3xl" />

      {/* Custom CSS for clip-path shapes */}
      <style jsx>{`
        .clip-path-triangle {
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }
        .clip-path-diamond {
          clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
        }
        .clip-path-hexagon {
          clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
        }
        .clip-path-star {
          clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
        }
        .clip-path-pentagon {
          clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
        }
      `}</style>

      {/* Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <GeometricShape
          delay={0.2}
          size={160}
          rotate={45}
          gradient="from-cyan-400/40"
          shape="triangle"
          className="left-[-5%] top-[8%]"
        />
        <GeometricShape
          delay={0.4}
          size={120}
          rotate={-30}
          gradient="from-teal-400/35"
          shape="diamond"
          className="right-[-3%] top-[15%]"
        />
        <GeometricShape
          delay={0.6}
          size={140}
          rotate={60}
          gradient="from-sky-400/40"
          shape="hexagon"
          className="left-[8%] top-[45%]"
        />
        <GeometricShape
          delay={0.8}
          size={100}
          rotate={-45}
          gradient="from-indigo-400/35"
          shape="star"
          className="right-[10%] top-[65%]"
        />
        <GeometricShape
          delay={1}
          size={110}
          rotate={90}
          gradient="from-purple-400/30"
          shape="pentagon"
          className="left-[15%] bottom-[20%]"
        />
        <GeometricShape
          delay={0.3}
          size={80}
          rotate={0}
          gradient="from-emerald-400/35"
          shape="triangle"
          className="right-[25%] bottom-[10%]"
        />
      </div>

      <div className="container relative z-10 mx-auto max-w-4xl px-4 py-16 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-slate-900/60 px-4 py-1.5 shadow-sm backdrop-blur-sm"
          >
            <MessageSquare className="h-5 w-5 text-cyan-400" />
            <span className="text-sm font-medium tracking-wide text-slate-200">Community Questions</span>
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl"
          >
            <span className="bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent">Browse</span>
            <br />
            <span
              className={cn(
                "bg-gradient-to-r from-cyan-400 via-teal-400 to-sky-400 bg-clip-text text-transparent",
                pacifico.className,
                "font-bold"
              )}
            >
              Questions
            </span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto"
          >
            Discover questions from the community. Vote on the ones you find helpful and contribute to the discussion.
          </motion.p>
        </div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search questions, tags, or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-900/60 border-slate-700/50 text-white placeholder:text-slate-400 focus:border-cyan-500/50"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative sort-dropdown">
              <Button
                variant="outline"
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 bg-slate-900/60 border-slate-700/50 text-white hover:bg-slate-800/60"
              >
                <Filter className="h-4 w-4" />
                {sortOptions.find(option => option.value === sortBy)?.label}
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform",
                  showSortDropdown && "rotate-180"
                )} />
              </Button>

              {/* Dropdown Menu */}
              {showSortDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-slate-900/95 border border-slate-700/50 rounded-lg shadow-lg backdrop-blur-sm z-50"
                >
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value as SortOption)
                        setShowSortDropdown(false)
                      }}
                      className={cn(
                        "w-full px-4 py-2 text-left text-sm transition-colors",
                        sortBy === option.value
                          ? "bg-cyan-500/20 text-cyan-400"
                          : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-slate-400">
            {debouncedSearchQuery ? (
              <span>
                Found {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''} 
                for "{debouncedSearchQuery}" • Showing {displayedQuestions.length} of {filteredQuestions.length}
              </span>
            ) : (
              <span>
                Showing {displayedQuestions.length} of {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </motion.div>

        {/* Questions List */}
        <div className="space-y-6">
          {displayedQuestions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              {debouncedSearchQuery ? (
                <div>
                  <p className="text-slate-400 text-lg mb-2">No questions found for "{debouncedSearchQuery}"</p>
                  <Button
                    variant="outline"
                    onClick={() => setSearchQuery("")}
                    className="mt-2"
                  >
                    Clear Search
                  </Button>
                </div>
              ) : (
                <p className="text-slate-400 text-lg">No questions yet. Be the first to ask one!</p>
              )}
            </motion.div>
          ) : (
            displayedQuestions.map((question, index) => (
              <QuestionCard key={question.id} question={question} index={index} />
            ))
          )}
        </div>

        {/* Load More Button */}
        {hasMoreQuestions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-center mt-8"
          >
            <Button
              onClick={loadMoreQuestions}
              disabled={loadingMore}
              size="lg"
              className="rounded-full border-none bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-600 hover:to-teal-600 hover:shadow-cyan-500/30 disabled:opacity-50"
            >
              {loadingMore ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Loading...
                </>
              ) : (
                `Load More Questions (${filteredQuestions.length - displayedQuestions.length} remaining)`
              )}
            </Button>
          </motion.div>
        )}


      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
    </div>
  )
}
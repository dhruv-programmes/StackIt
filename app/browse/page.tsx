"use client";

import { motion, cubicBezier } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown, MessageSquare, User, Calendar, Eye } from "lucide-react"
import { Pacifico } from "next/font/google"
import { cn } from "@/lib/utils"
import { useState } from "react"

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
})

// Mock data for questions
const mockQuestions = [
  {
    id: 1,
    title: "How to implement efficient state management in React?",
    description: "I'm working on a large React application and struggling with **state management**. Should I use Redux, Zustand, or stick with Context API?\n\n```javascript\nconst [state, setState] = useState({})\n```\n\nAny recommendations for best practices?",
    votes: 42,
    author: "alex_dev",
    timestamp: "2 hours ago",
    views: 156,
    tags: ["react", "state-management", "redux"]
  },
  {
    id: 2,
    title: "Best practices for API error handling in Node.js",
    description: "What's the most effective way to handle errors in a Node.js API? I'm currently using try-catch blocks everywhere but it feels repetitive.\n\n> Looking for a more elegant solution that doesn't compromise error reporting.",
    votes: 28,
    author: "backend_wizard",
    timestamp: "4 hours ago",
    views: 89,
    tags: ["nodejs", "error-handling", "api"]
  },
  {
    id: 3,
    title: "CSS Grid vs Flexbox: When to use which?",
    description: "I often get confused about when to use **CSS Grid** vs **Flexbox**. Can someone explain the key differences and use cases?\n\n- Grid seems better for 2D layouts\n- Flexbox for 1D layouts\n\nBut I'd love more specific examples!",
    votes: 67,
    author: "css_ninja",
    timestamp: "6 hours ago",
    views: 234,
    tags: ["css", "layout", "flexbox", "grid"]
  },
  {
    id: 4,
    title: "Database indexing strategies for performance optimization",
    description: "My PostgreSQL queries are getting slower as data grows. What are the best indexing strategies?\n\n```sql\nCREATE INDEX idx_user_created_at ON users(created_at);\n```\n\nAny other optimization tips?",
    votes: 15,
    author: "db_expert",
    timestamp: "8 hours ago",
    views: 67,
    tags: ["postgresql", "performance", "indexing"]
  },
  {
    id: 5,
    title: "TypeScript generics: Advanced patterns and use cases",
    description: "I'm diving deeper into TypeScript and want to understand **advanced generic patterns**. Conditional types, mapped types, template literals...\n\n> What are some real-world scenarios where these become essential?",
    votes: 91,
    author: "ts_master",
    timestamp: "12 hours ago",
    views: 312,
    tags: ["typescript", "generics", "advanced"]
  }
]

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

function QuestionCard({ question, index }: { question: any, index: number }) {
  const [votes, setVotes] = useState(question.votes)
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null)

const handleVote = (type: 'up' | 'down') => {
  if (userVote === type) {
    // Remove vote
    setVotes((prev: number) => prev + (type === 'up' ? -1 : 1))
    setUserVote(null)
  } else {
    // Add or change vote
    const change = userVote === null ? 
      (type === 'up' ? 1 : -1) : 
      (type === 'up' ? 2 : -2)
    setVotes((prev: number) => prev + change)
    setUserVote(type)
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
            className={cn(
              "h-8 w-8 p-0 rounded-full transition-all duration-200",
              userVote === 'up' 
                ? "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30" 
                : "text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10"
            )}
          >
            <ArrowUp className="h-4 w-4" />
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
            className={cn(
              "h-8 w-8 p-0 rounded-full transition-all duration-200",
              userVote === 'down' 
                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" 
                : "text-slate-400 hover:text-red-400 hover:bg-red-500/10"
            )}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors cursor-pointer">
            {question.title}
          </h3>
          
          <div 
            className="mt-3 text-slate-300 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(question.description) }}
          />

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {question.tags.map((tag: string) => (
              <span
                key={tag}
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
              <span>{question.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{question.timestamp}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{question.views} views</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function BrowseQuestions() {
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

        {/* Questions List */}
        <div className="space-y-6">
          {mockQuestions.map((question, index) => (
            <QuestionCard key={question.id} question={question} index={index} />
          ))}
        </div>

        {/* Load More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            className="rounded-full border-none bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-600 hover:to-teal-600 hover:shadow-cyan-500/30"
          >
            Load More Questions
          </Button>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
    </div>
  )
}
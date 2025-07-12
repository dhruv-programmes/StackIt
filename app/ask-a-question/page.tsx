"use client"

import { useState } from "react"
import { motion, cubicBezier } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, MessageSquare, Tag, X, Eye, Edit } from "lucide-react"
import { Pacifico } from "next/font/google"
import { cn } from "@/lib/utils"

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
})

interface TipTapEditorProps {
  content: string
  onChange: (content: string) => void
}

// Enhanced TipTap Editor with Live Preview
function TipTapEditor({ content, onChange }: { content: string; onChange: (content: string) => void }) {

  const [isActive, setIsActive] = useState(false)
  const [localContent, setLocalContent] = useState(content || "")
  const [isPreview, setIsPreview] = useState(false)

  const handleContentChange = (e:any) => {
    const newContent = e.target.value
    setLocalContent(newContent)
    onChange(newContent)
  }

  const formatCommands = [
    { label: "B", command: "bold", format: "**" },
    { label: "I", command: "italic", format: "*" },
    { label: "</>", command: "code", format: "`" },
    { label: "H2", command: "heading", format: "## " },
    { label: "•", command: "list", format: "- " },
    { label: "1.", command: "ordered", format: "1. " },
  ]

  const applyFormat = (format : string) => {
    const textarea = document.getElementById('editor-textarea') as HTMLTextAreaElement
    const start = textarea?.selectionStart
    const end = textarea.selectionEnd
    const selectedText = localContent.substring(start, end)
    
    if (selectedText) {
      let formattedText = selectedText
      switch (format) {
        case "**":
          formattedText = `**${selectedText}**`
          break
        case "*":
          formattedText = `*${selectedText}*`
          break
        case "`":
          formattedText = `\`${selectedText}\``
          break
        case "## ":
          formattedText = `## ${selectedText}`
          break
        case "- ":
          formattedText = `- ${selectedText}`
          break
        case "1. ":
          formattedText = `1. ${selectedText}`
          break
        default:
          break
      }
      
      const newContent = localContent.substring(0, start) + formattedText + localContent.substring(end)
      setLocalContent(newContent)
      onChange(newContent)
    }
  }

  const renderMarkdown = (text:any) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-slate-700 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold text-slate-200 mb-2">$1</h2>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(/\n/g, '<br />')
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-slate-700 pb-2">
        <div className="flex gap-1">
          {formatCommands.map((cmd) => (
            <button
              key={cmd.command}
              type="button"
              onClick={() => applyFormat(cmd.format)}
              className="px-2 py-1 text-xs rounded hover:bg-slate-700 text-slate-300 transition-colors"
            >
              {cmd.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center gap-1 px-3 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
          >
            {isPreview ? <Edit className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            {isPreview ? "Edit" : "Preview"}
          </button>
        </div>
      </div>
      
      <div className="relative">
        {isPreview ? (
          <div 
            className="min-h-[200px] p-3 text-sm leading-relaxed text-slate-200 prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(localContent) }}
          />
        ) : (
          <textarea
            id="editor-textarea"
            value={localContent}
            onChange={handleContentChange}
            onFocus={() => setIsActive(true)}
            onBlur={() => setIsActive(false)}
            placeholder="Describe your question in detail. You can use markdown formatting."
            className={cn(
              "w-full min-h-[200px] resize-none bg-transparent text-slate-200 placeholder:text-slate-500 focus:outline-none",
              "text-sm leading-relaxed p-3"
            )}
          />
        )}
      </div>
      
      <div className="flex justify-between items-center text-xs text-slate-500">
        <span>Markdown supported</span>
        <span>{localContent.length} characters</span>
      </div>
    </div>
  )
}

// Unique geometric shapes
function GeometricShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-cyan-400/30",
  shapeType = "circle",
}: {
  className?: string
  delay?: number
  width?: number
  height?: number
  rotate?: number
  gradient?: string
  shapeType?: "circle" | "square" | "triangle" | "hexagon" | "diamond"
}) {
  const getShapeClasses = () => {
    switch (shapeType) {
      case "square":
        return "rounded-2xl"
      case "triangle":
        return "clip-path-triangle"
      case "hexagon":
        return "clip-path-hexagon"
      case "diamond":
        return "rotate-45 rounded-xl"
      default:
        return "rounded-full"
    }
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.3,
        rotate: rotate - 20,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: rotate,
      }}
      transition={{
        duration: 2.8,
        delay,
        ease: cubicBezier(0.34, 1.56, 0.64, 1),
        opacity: { duration: 1.5 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0",
            getShapeClasses(),
            "bg-gradient-to-br to-transparent",
            gradient,
            "border-2 border-white/10 backdrop-blur-sm",
            "shadow-[0_12px_40px_0_rgba(34,211,238,0.2)]",
            "before:absolute before:inset-0 before:bg-gradient-to-t before:from-white/5 before:to-transparent",
            "before:rounded-inherit",
          )}
        />
        <div
          className={cn(
            "absolute inset-2",
            getShapeClasses(),
            "bg-gradient-to-tr from-white/5 to-transparent",
            "border border-white/5",
          )}
        />
      </motion.div>
    </motion.div>
  )
}

export default function AskQuestionForm() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [tagList, setTagList] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        delay: 0.2 + i * 0.12,
        ease: cubicBezier(0.23, 1, 0.32, 1),
      },
    }),
  }

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    // Handle comma separation
    if (value.includes(",")) {
      const newTags = value.split(",")
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0 && !tagList.includes(tag))
      
      if (newTags.length > 0) {
        setTagList([...tagList, ...newTags])
        setTags("")
      }
    } else {
      setTags(value)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tags.trim()) {
      e.preventDefault()
      const newTag = tags.trim()
      if (!tagList.includes(newTag)) {
        setTagList([...tagList, newTag])
        setTags("")
      }
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTagList(tagList.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) return
    
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log({
      title,
      description,
      tags: [...tagList, ...tags.split(",").map(tag => tag.trim())].filter(tag => tag.length > 0),
    })
    
    // Reset form
    setTitle("")
    setDescription("")
    setTags("")
    setTagList([])
    setIsSubmitting(false)
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950 py-20">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-cyan-500/10 to-teal-500/10 blur-3xl" />
      
      {/* Unique geometric shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <GeometricShape
          delay={0.3}
          width={180}
          height={180}
          rotate={15}
          gradient="from-violet-400/20 to-purple-400/20"
          shapeType="hexagon"
          className="left-[5%] top-[10%]"
        />
        <GeometricShape
          delay={0.5}
          width={120}
          height={120}
          rotate={-30}
          gradient="from-cyan-400/25 to-blue-400/25"
          shapeType="diamond"
          className="right-[10%] top-[20%]"
        />
        <GeometricShape
          delay={0.4}
          width={200}
          height={200}
          rotate={45}
          gradient="from-teal-400/20 to-emerald-400/20"
          shapeType="square"
          className="left-[15%] bottom-[15%]"
        />
        <GeometricShape
          delay={0.6}
          width={150}
          height={150}
          rotate={-15}
          gradient="from-pink-400/15 to-rose-400/15"
          shapeType="circle"
          className="right-[5%] bottom-[25%]"
        />
        <GeometricShape
          delay={0.7}
          width={100}
          height={100}
          rotate={60}
          gradient="from-amber-400/20 to-orange-400/20"
          shapeType="triangle"
          className="left-[40%] top-[5%]"
        />
        <GeometricShape
          delay={0.8}
          width={80}
          height={80}
          rotate={-45}
          gradient="from-indigo-400/25 to-purple-400/25"
          shapeType="diamond"
          className="right-[30%] bottom-[10%]"
        />
      </div>

      <div className="container relative z-10 mx-auto max-w-4xl px-6">
        <div className="mx-auto max-w-2xl">
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="mb-12 text-center"
          >
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-slate-900/70 px-5 py-2 shadow-lg backdrop-blur-sm">
              <MessageSquare className="h-5 w-5 text-violet-400" />
              <span className="text-sm font-medium tracking-wide text-slate-200">New Question</span>
            </div>

            <h1 className="mb-6 text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent">Ask a</span>
              <br />
              <span
                className={cn(
                  "bg-gradient-to-r from-violet-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent",
                  pacifico.className,
                  "font-bold"
                )}
              >
                Question
              </span>
            </h1>

            <p className="text-lg leading-relaxed text-slate-400 max-w-lg mx-auto">
              Share your knowledge, spark discussions, and get help from our vibrant community
            </p>
          </motion.div>

          <motion.div
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="rounded-3xl border border-slate-700/30 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-md"
          >
            <div className="space-y-8">
              <motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
                <label className="mb-4 block text-sm font-semibold text-slate-300">
                  Question Title
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., How to implement authentication in Next.js 14?"
                  className="h-12 bg-slate-800/60 border-slate-600/50 text-white placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-violet-500/50 focus-visible:border-violet-400/50 rounded-xl"
                />
              </motion.div>

              <motion.div custom={3} variants={fadeUpVariants} initial="hidden" animate="visible">
                <label className="mb-4 block text-sm font-semibold text-slate-300">
                  Description
                </label>
                <div className="rounded-xl border border-slate-600/50 bg-slate-800/50 backdrop-blur-sm">
                  <TipTapEditor content={description} onChange={setDescription} />
                </div>
              </motion.div>

              <motion.div custom={4} variants={fadeUpVariants} initial="hidden" animate="visible">
                <label className="mb-4 block text-sm font-semibold text-slate-300">
                  Tags
                </label>
                <div className="space-y-4">
                  {tagList.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tagList.map((tag, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-400/20 to-cyan-400/20 px-4 py-2 text-sm text-slate-200 border border-violet-400/30"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-violet-400 hover:text-violet-300 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </motion.span>
                      ))}
                    </div>
                  )}
                  <Input
                    value={tags}
                    onChange={handleTagsChange}
                    onKeyPress={handleKeyPress}
                    placeholder="e.g., react, nextjs, authentication (press Enter or use commas)"
                    className="h-12 bg-slate-800/60 border-slate-600/50 text-white placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-cyan-500/50 focus-visible:border-cyan-400/50 rounded-xl"
                  />
                </div>
              </motion.div>

              <motion.div custom={5} variants={fadeUpVariants} initial="hidden" animate="visible">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !title.trim() || !description.trim()}
                  className="w-full h-12 rounded-xl border-none bg-gradient-to-r from-violet-500 via-cyan-500 to-teal-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:from-violet-600 hover:via-cyan-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {isSubmitting ? "Posting Question..." : "Post Question"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/50" />
    </div>
  )
}
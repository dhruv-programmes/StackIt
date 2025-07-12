"use client"

import { motion, cubicBezier } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, MessageSquare } from "lucide-react"
import { Pacifico } from "next/font/google"
import { cn } from "@/lib/utils"

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
})

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}: {
  className?: string
  delay?: number
  width?: number
  height?: number
  rotate?: number
  gradient?: string
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: cubicBezier(0.23, 0.86, 0.39, 0.96),
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
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
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "border-2 border-white/20 backdrop-blur-[2px]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.15)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent_70%)]",
          )}
        />
      </motion.div>
    </motion.div>
  )
}

export default function HeroGeometric({
  badge = "StackIt",
  title1 = "Ask Better",
  title2 = "Learn Together",
}: {
  badge?: string
  title1?: string
  title2?: string
}) {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: cubicBezier(0.25, 0.4, 0.25, 1),
      },
    }),
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-teal-500/20 blur-3xl" />

      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-cyan-400/60"
          className="left-[-10%] top-[15%] md:left-[-5%] md:top-[20%]"
        />
        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-teal-400/60"
          className="right-[-5%] top-[70%] md:right-[0%] md:top-[75%]"
        />
        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-sky-400/60"
          className="bottom-[5%] left-[5%] md:bottom-[10%] md:left-[10%]"
        />
        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-blue-400/60"
          className="right-[15%] top-[10%] md:right-[20%] md:top-[15%]"
        />
        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-indigo-400/60"
          className="left-[20%] top-[5%] md:left-[25%] md:top-[10%]"
        />
      </div>

      <div className="container relative z-10 mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-slate-900/60 px-4 py-1.5 shadow-sm backdrop-blur-sm md:mb-12"
          >
            <MessageSquare className="h-5 w-5 text-cyan-400" />
            <span className="text-sm font-medium tracking-wide text-slate-200">{badge}</span>
          </motion.div>

          <motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="visible">
            <h1 className="mx-4 mb-6 text-4xl font-bold tracking-tight text-white sm:text-6xl md:mb-8 md:text-8xl">
              <span className="bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent">{title1}</span>
              <br />
              <span
                className={cn(
                  "bg-gradient-to-r from-cyan-400 via-teal-400 to-sky-400 bg-clip-text p-4 text-transparent",
                  pacifico.className,
                  "font-bold",
                )}
              >
                {title2}
              </span>
            </h1>
          </motion.div>

          <motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
            <p className="mx-auto mb-10 max-w-xl px-4 text-base leading-relaxed text-slate-400 sm:text-lg md:text-xl">
              A minimal and focused Q&A platform designed for structured knowledge sharing within a collaborative
              community.
            </p>
          </motion.div>

          <motion.div
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col justify-center gap-4 sm:flex-row"
          >
            <Button
              size="lg"
              className="rounded-full border-none bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-600 hover:to-teal-600 hover:shadow-cyan-500/30"
            >
              Ask a Question
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-slate-600 bg-slate-900/60 text-slate-200 shadow-sm backdrop-blur-sm hover:bg-slate-800/60 hover:text-white hover:border-cyan-400/50"
            >
              Browse Questions
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/80" />
    </div>
  )
}

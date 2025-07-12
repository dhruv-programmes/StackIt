"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, X } from "lucide-react"

interface ToastProps {
  message: string
  type: "success" | "error"
  isVisible: boolean
  onClose: () => void
}

export function Toast({ message, type, isVisible, onClose }: ToastProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.3 }}
          className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg ${
            type === "success" 
              ? "bg-green-500 text-white" 
              : "bg-red-500 text-white"
          }`}
        >
          {type === "success" ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <XCircle className="h-5 w-5" />
          )}
          <span className="text-sm font-medium">{message}</span>
          <button
            onClick={onClose}
            className="ml-2 text-white/80 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 
import type { TargetAndTransition } from 'framer-motion'

export const fadeUpVariants: {
  hidden: TargetAndTransition
  visible: (i: number) => TargetAndTransition
} = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      delay: 0.5 + i * 0.2,
      ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
    },
  }),
}

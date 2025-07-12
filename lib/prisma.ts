import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

// Simplified connection handling for production
if (process.env.NODE_ENV === 'production') {
  // Don't pre-connect in production to avoid connection pool issues
  console.log('📊 Prisma client initialized for production')
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 
const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function migrateData() {
  try {
    console.log('Starting data migration...')
    
    // Read existing questions from JSON file
    const questionsPath = path.join(process.cwd(), 'data', 'questions.json')
    const questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'))
    
    console.log(`Found ${questionsData.length} questions to migrate`)
    
    for (const questionData of questionsData) {
      // Create or update user
      const user = await prisma.user.upsert({
        where: { id: questionData.authorId },
        update: {
          name: questionData.author.name,
          email: questionData.author.email || null,
          image: questionData.author.image,
        },
        create: {
          id: questionData.authorId,
          name: questionData.author.name,
          email: questionData.author.email || null,
          image: questionData.author.image,
        },
      })
      
      // Create question
      const question = await prisma.question.create({
        data: {
          id: questionData.id,
          title: questionData.title,
          description: questionData.description,
          tags: JSON.stringify(questionData.tags || []),
          authorId: user.id,
          createdAt: new Date(questionData.createdAt),
          votes: questionData.votes || 0,
        },
      })
      
      console.log(`Created question: ${question.title}`)
      
      // Create comments if they exist
      if (questionData.comments && questionData.comments.length > 0) {
        for (const commentData of questionData.comments) {
          await prisma.comment.create({
            data: {
              id: commentData.id,
              content: commentData.content,
              authorId: user.id, // Using the same user for now
              questionId: question.id,
              createdAt: new Date(commentData.createdAt),
              votes: commentData.votes || 0,
            },
          })
        }
        console.log(`Created ${questionData.comments.length} comments for question: ${question.title}`)
      }
    }
    
    console.log('Data migration completed successfully!')
  } catch (error) {
    console.error('Migration failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

migrateData() 
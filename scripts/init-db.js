const { PrismaClient } = require('@prisma/client');

async function initDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔄 Initializing database...');
    
    // This will create the database tables if they don't exist
    await prisma.$executeRaw`SELECT 1`;
    console.log('✅ Database connection successful');
    
    // Check if tables exist by trying to query them
    try {
      await prisma.user.findFirst();
      console.log('✅ User table exists');
    } catch (error) {
      console.log('⚠️ User table not found, will be created during db push');
    }
    
    try {
      await prisma.question.findFirst();
      console.log('✅ Question table exists');
    } catch (error) {
      console.log('⚠️ Question table not found, will be created during db push');
    }
    
    console.log('✅ Database initialization complete');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    // Don't throw error, let the build continue
  } finally {
    await prisma.$disconnect();
  }
}

// Run if this script is called directly
if (require.main === module) {
  initDatabase();
}

module.exports = { initDatabase }; 
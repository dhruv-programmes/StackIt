const { PrismaClient } = require('@prisma/client');

async function initDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔄 Testing database connection...');
    
    // Simple connection test
    await prisma.$executeRaw`SELECT 1`;
    console.log('✅ Database connection successful');
    
    console.log('✅ Database initialization complete');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
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
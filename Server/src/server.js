import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';
import { seedDatabase } from './seed/seedData.js';
import { startSeatCleanupJob } from './utils/seatCleanup.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Connect to Database
    await connectDB();

    // 2. Seed initial data if DB is empty
    await seedDatabase();

    // 3. Start background seat hold cleanup job
    startSeatCleanupJob(30000);

    // 4. Start HTTP server
    const server = app.listen(PORT, () => {
      console.log(`=============================================`);
      console.log(`🎬 CineBook API Server running on port ${PORT}`);
      console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Health endpoint: http://localhost:${PORT}/api/health`);
      console.log(`=============================================`);
    });

    // Handle Unhandled Rejections
    process.on('unhandledRejection', (err) => {
      console.error(`[Server Error] Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error(`[Server Startup Failed]: ${error.message}`);
    process.exit(1);
  }
};

startServer();

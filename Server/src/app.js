import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/authRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import theatreRoutes from './routes/theatreRoutes.js';
import showRoutes from './routes/showRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import offerRoutes from './routes/offerRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map(u => u.trim()) : [])
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps or curl)
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        allowedOrigins.includes('*') ||
        process.env.NODE_ENV !== 'production' ||
        (process.env.CLIENT_URL && (process.env.CLIENT_URL === '*' || origin.startsWith(process.env.CLIENT_URL.replace(/\/$/, ''))))
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS policy'));
      }
    },
    credentials: true,
  })
);

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 10000, // relaxed for development and active browsing
  skip: (req) => process.env.NODE_ENV !== 'production' || req.ip === '127.0.0.1' || req.ip === '::1' || req.ip === '::ffff:127.0.0.1',
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' },
});
app.use('/api/', limiter);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'CineBook Movie Booking Engine',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/theatres', theatreRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;

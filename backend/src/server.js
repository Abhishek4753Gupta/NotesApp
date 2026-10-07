import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import noteRoutes from './routes/noteRoutes.js';
import authRoutes from './routes/authRoutes.js';
import suggestionRoutes from './routes/suggestionRoutes.js';
import { connectDB } from './config/db.js';
import rateLimiterMiddleware from './middleware/rateLimiter.js';  

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();
app.use(cors());
app.use(express.json());
app.use(rateLimiterMiddleware); // Apply rate limiting middleware to all routes
app.use('/api/auth', authRoutes);
app.use('/api/notes',noteRoutes);
app.use('/api/suggestions', suggestionRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from "./config/db.js";
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import dotenv from "dotenv";
import analyticsRoutes from "./routes/analyticsRoutes.js";


dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*' }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => res.json({ ok: true, name: 'EventX Studio' }));

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use(errorHandler);
export default app;

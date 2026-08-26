import 'dotenv/config';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './db';
import authRoutes from './routes/auth';
import contactRoutes from './routes/contact';
import newsletterRoutes from './routes/newsletter';

// Connect to MongoDB
connectDB();

const app: Application = express();

// Trust reverse proxy for rate limiting (e.g. Vercel/Render load balancers)
app.set('trust proxy', 1);

// Middleware
const allowedOrigin = process.env.SITE_URL;

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost for local development
    if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    
    // Allow the specific SITE_URL from env
    if (origin === allowedOrigin) {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Prepify Backend API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

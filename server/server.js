import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

// Middleware Imports
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import User from './models/User.js';

// Serve static uploaded documents
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load ENV
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect DB
connectDB();

const app = express();

// Configure CORS (Enable Frontend Dev Server)
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Root Ping
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Vibhuti Enterprise Premium Financial API Server is Active.' });
});

// Automatic Seeding of Default Administrator Account
const seedAdmin = async () => {
  try {
    const adminEmail = 'admin@vibhuti.com';
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      await User.create({
        name: 'Vibhuti Executive Admin',
        email: adminEmail,
        password: 'Admin@123',
        phone: '+91 98765 43210',
        role: 'admin'
      });
      console.log('----------------------------------------------------');
      console.log('Seeding Success: Default admin account created.');
      console.log(`Email: ${adminEmail}`);
      console.log('Password: Admin@123');
      console.log('----------------------------------------------------');
    }
  } catch (error) {
    console.warn('Seeding skipped or MongoDB offline. Admin seeding can proceed once MongoDB starts.');
  }
};

// Execute seeding after a short timeout to allow DB connection to settle
setTimeout(seedAdmin, 3000);

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server launched in development on port: ${PORT}`);
});

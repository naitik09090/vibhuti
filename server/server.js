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
import BlogPost from './models/BlogPost.js';
import { blogPosts } from './data/staticBlogs.js';

// Serve static uploaded documents
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load ENV
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect DB
connectDB();

const app = express();

// Configure CORS (Enable Frontend Dev Server & Production Deployments)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5000'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Allow server-to-server / curl

    const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
    const isVercel = origin.endsWith('.vercel.app');
    const isNetlify = origin.endsWith('.netlify.app');
    const isAllowedCustom = process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL;

    if (isLocalhost || isVercel || isNetlify || isAllowedCustom) {
      return callback(null, true);
    }

    // Allow all origins in non-production for easier dev
    if (process.env.NODE_ENV !== 'production') return callback(null, true);

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

// Automatic Seeding of Static Blog Posts
const seedBlogs = async () => {
  try {
    for (const post of blogPosts) {
      const exists = await BlogPost.findById(post._id);
      if (!exists) {
        await BlogPost.create({
          _id: post._id,
          title: post.title,
          summary: post.summary,
          content: post.content,
          author: post.author,
          tags: post.tags,
          coverImage: post.coverImage,
          createdAt: post.createdAt ? new Date(post.createdAt) : new Date(),
        });
        console.log(`Startup Seeding: Added blog post "${post.title.substring(0, 30)}..."`);
      }
    }
  } catch (error) {
    console.warn('Startup blog seeding skipped or MongoDB offline:', error.message);
  }
};

// Execute all startup seeds after a short timeout to allow DB connection to settle
const runAllSeeds = async () => {
  await seedAdmin();
  await seedBlogs();
};
setTimeout(runAllSeeds, 3000);

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

// Start server only in non-serverless environments (local dev, Render, Railway)
// On Netlify Functions / AWS Lambda, listening to a port is not needed
const isServerless = process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME;
if (!isServerless) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT} | ENV: ${process.env.NODE_ENV || 'development'}`);
  });
}

export default app;

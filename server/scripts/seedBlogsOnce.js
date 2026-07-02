import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import BlogPost from '../models/BlogPost.js';
import { blogPosts } from '../data/staticBlogs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vibhuti_db';

const seed = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected successfully!');

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
        console.log(`Seeding Success: Blog post "${post.title.substring(0, 30)}..." added.`);
      } else {
        console.log(`Skipped (already exists): "${post.title.substring(0, 30)}..."`);
      }
    }

    console.log('Seeding finished successfully!');
  } catch (error) {
    console.error('Error during seeding:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
};

seed();

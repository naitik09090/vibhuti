import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vibhuti_db');
    console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Do not crash the process immediately in development so fallback systems can run if mongo is offline
    console.warn('Running with database mock fallback capabilities.');
  }
};

export default connectDB;

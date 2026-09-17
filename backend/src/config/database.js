import mongoose from 'mongoose';
export const connectDatabase = () => mongoose.connect(process.env.MONGODB_URI).then(() => console.info('MongoDB connected'));

import mongoose from 'mongoose';
import { app } from './app.js';
import { env } from './config/env.js';

try {
  await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  app.listen(env.PORT, () => console.log(`AI Mystery Room API listening on port ${env.PORT}`));
} catch (error) {
  console.error(`Database connection failed (${error.name}). Check MONGODB_URI and ensure MongoDB is running.`);
  process.exit(1);
}

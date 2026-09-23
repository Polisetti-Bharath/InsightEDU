import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Missing MONGODB_URI environment variable. Define it in .env.local (see .env.example).",
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var __insightEduMongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global.__insightEduMongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global.__insightEduMongooseCache) {
  global.__insightEduMongooseCache = cache;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(MONGODB_URI as string, {
        bufferCommands: false,
        dbName: "insightedu",
      })
      .then((instance) => instance);
  }

  try {
    cache.conn = await cache.promise;
  } catch (error) {
    cache.promise = null;
    throw error;
  }

  return cache.conn;
}

export default connectToDatabase;

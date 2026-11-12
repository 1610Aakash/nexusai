import mongoose from "mongoose";

type MongooseCache = {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache =
  global.mongooseCache ??
  (global.mongooseCache = {
    connection: null,
    promise: null,
  });

export async function connectToDatabase(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (cache.connection?.connection.readyState === 1) {
    return cache.connection;
  }

  if (cache.connection) {
    cache.connection = null;
    cache.promise = null;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, { bufferCommands: false }).catch((error: unknown) => {
      cache.promise = null;
      throw error;
    });
  }

  try {
    cache.connection = await cache.promise;
    return cache.connection;
  } catch (error) {
    cache.promise = null;
    throw error;
  }
}

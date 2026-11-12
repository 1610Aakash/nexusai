import mongoose, { type ClientSession } from "mongoose";

function supportsTransactions(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return /transactions are not supported|replica set|mongos|transaction numbers are only allowed|does not support transactions/i.test(
    error.message,
  );
}

export async function withMongoTransaction<T>(
  operation: (session: ClientSession | null) => Promise<T>,
): Promise<T> {
  const session = await mongoose.startSession();
  try {
    try {
      let result!: T;
      let completed = false;
      await session.withTransaction(async () => {
        result = await operation(session);
        completed = true;
      });
      if (!completed) throw new Error("Transaction completed without executing its operation");
      return result;
    } catch (error) {
      if (!supportsTransactions(error)) throw error;
      return operation(null);
    }
  } finally {
    await session.endSession();
  }
}

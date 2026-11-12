import { connection, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    await connection();
    await connectToDatabase();

    return NextResponse.json({
      success: true,
      message: "NexusAI API is running",
      database: "Connected",
    });
  } catch {
    console.error("Health check failed: MongoDB connection is unavailable");

    return NextResponse.json(
      {
        success: false,
        message: "NexusAI API is unavailable",
        database: "Disconnected",
      },
      { status: 500 },
    );
  }
}

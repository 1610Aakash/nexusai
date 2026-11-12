import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly errors: unknown[] = [],
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function successResponse<T>(
  message: string,
  data: T,
  status = 200,
): NextResponse {
  return NextResponse.json({ success: true, message, data }, { status });
}

export function errorResponse(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { success: false, message: error.message, errors: error.errors },
      { status: error.status },
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        message: "Please check the provided information",
        errors: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 },
    );
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  ) {
    return NextResponse.json(
      { success: false, message: "A record with these details already exists", errors: [] },
      { status: 409 },
    );
  }

  console.error("API request failed", {
    errorType: error instanceof Error ? error.name : "UnknownError",
  });
  return NextResponse.json(
    { success: false, message: "An unexpected error occurred", errors: [] },
    { status: 500 },
  );
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new ApiError(400, "A valid JSON request body is required");
  }
}

export function assertSameOrigin(request: Request): void {
  const expectedOrigin = new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ).origin;
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  let requestOrigin = origin;
  if (!requestOrigin && referer) {
    try {
      requestOrigin = new URL(referer).origin;
    } catch {
      throw new ApiError(403, "Request origin could not be verified");
    }
  }

  if (!requestOrigin || requestOrigin !== expectedOrigin) {
    throw new ApiError(403, "Request origin could not be verified");
  }
}

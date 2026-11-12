export type ApiResponse<T> = {
  success: true;
  message: string;
  data: T;
};

export class RequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "RequestError";
  }
}

export async function requestApi<T>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<ApiResponse<T>> {
  const response = await fetch(path, {
    method: options.method ?? (options.body ? "POST" : "GET"),
    credentials: "same-origin",
    headers: options.body ? { "Content-Type": "application/json" } : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new RequestError("The server returned an invalid response", response.status);
  }

  if (!response.ok) {
    const message =
      typeof payload === "object" &&
      payload !== null &&
      "message" in payload &&
      typeof payload.message === "string"
        ? payload.message
        : "The request could not be completed";
    throw new RequestError(message, response.status);
  }

  return payload as ApiResponse<T>;
}

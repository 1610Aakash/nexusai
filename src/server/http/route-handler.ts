import type { NextRequest } from "next/server";
import { errorResponse } from "./api-response";

type RouteContext = { params: Promise<Record<string, string>> };
type RouteFunction = (
  request: NextRequest,
  context: RouteContext,
) => Promise<Response>;

export function routeHandler(handler: RouteFunction): RouteFunction {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return errorResponse(error);
    }
  };
}

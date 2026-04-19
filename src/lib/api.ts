// Small helpers for consistent API route responses.

import { NextResponse } from "next/server";
import { ZodError, type ZodSchema } from "zod";

export type ApiError = {
  error: string;
  details?: unknown;
};

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, init);
}

export function created<T>(data: T) {
  return NextResponse.json({ data }, { status: 201 });
}

export function badRequest(message: string, details?: unknown) {
  return NextResponse.json<ApiError>(
    { error: message, details },
    { status: 400 },
  );
}

export function notFound(message = "Not found") {
  return NextResponse.json<ApiError>({ error: message }, { status: 404 });
}

export function serverError(err: unknown) {
  const message =
    err instanceof Error ? err.message : "Unexpected server error";
  return NextResponse.json<ApiError>({ error: message }, { status: 500 });
}

export async function parseJson<T>(
  request: Request,
  schema: ZodSchema<T>,
): Promise<{ ok: true; data: T } | { ok: false; response: Response }> {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return { ok: false, response: badRequest("Invalid JSON body") };
  }
  try {
    const data = schema.parse(json);
    return { ok: true, data };
  } catch (err) {
    if (err instanceof ZodError) {
      return {
        ok: false,
        response: badRequest("Validation failed", err.flatten()),
      };
    }
    return { ok: false, response: serverError(err) };
  }
}

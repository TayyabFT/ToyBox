import type { ApiError } from "@/types/api";

export const SERVER_UNAVAILABLE_MESSAGE =
  "We're having trouble connecting right now. Please check your internet connection and try again in a few moments.";

export const SERVER_ERROR_MESSAGE =
  "Something went wrong on our end. Please try again later.";

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "message" in error &&
    typeof (error as ApiError).message === "string"
  );
}

export function isNetworkFailure(error: unknown): boolean {
  if (!(error instanceof TypeError)) {
    return false;
  }

  const message = error.message.toLowerCase();

  return (
    message.includes("failed to fetch") ||
    message.includes("networkerror") ||
    message.includes("network request failed") ||
    message.includes("load failed")
  );
}

export function createNetworkError(): ApiError {
  return {
    status: 0,
    message: SERVER_UNAVAILABLE_MESSAGE,
  };
}

export function normalizeHttpError(
  status: number,
  apiMessage?: string | null,
): ApiError {
  const trimmedMessage = apiMessage?.trim();

  if (status === 0) {
    return createNetworkError();
  }

  if (status === 502 || status === 503 || status === 504) {
    return {
      status,
      message: SERVER_UNAVAILABLE_MESSAGE,
    };
  }

  if (status >= 500) {
    return {
      status,
      message: trimmedMessage || SERVER_ERROR_MESSAGE,
    };
  }

  return {
    status,
    message: trimmedMessage || `Request failed with status ${status}`,
  };
}

export function normalizeRequestError(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): ApiError {
  if (isApiError(error)) {
    return error;
  }

  if (isNetworkFailure(error)) {
    return createNetworkError();
  }

  if (error instanceof Error && error.message.trim()) {
    return {
      status: 0,
      message: error.message.trim(),
    };
  }

  if (typeof error === "string" && error.trim()) {
    return {
      status: 0,
      message: error.trim(),
    };
  }

  return {
    status: 0,
    message: fallback,
  };
}

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  return normalizeRequestError(error, fallback).message;
}

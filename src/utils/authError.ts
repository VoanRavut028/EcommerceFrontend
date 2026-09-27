export function getAuthErrorCode(
  error: unknown,
  fallbackCode: string,
): string {
  if (typeof error !== "object" || error === null || !("response" in error)) {
    return fallbackCode;
  }

  const response = error.response;
  if (typeof response !== "object" || response === null || !("data" in response)) {
    return fallbackCode;
  }

  const data = response.data;
  if (typeof data !== "object" || data === null || !("code" in data)) {
    return fallbackCode;
  }

  return typeof data.code === "string" ? data.code : fallbackCode;
}

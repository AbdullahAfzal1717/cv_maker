export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api/v1";

export const getHeaders = (token?: string | null): HeadersInit => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

import { API_URL, getHeaders } from "./api";

const handleResponse = async (response: Response, defaultError: string) => {
  const resData = await response.json();
  if (!response.ok || !resData.success) {
    throw new Error(resData.message || defaultError);
  }
  return resData.data;
};

export const authService = {
  getCurrentUser: async (token: string) => {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: getHeaders(token),
    });
    return handleResponse(response, "Session validation failed.");
  },

  login: async (login: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ login, password }),
    });
    return handleResponse(response, "Invalid credentials execution error.");
  },

  register: async (username: string, email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ username, email, password }),
    });
    return handleResponse(response, "Registration request failed.");
  },

  updateProfile: async (
    token: string,
    data: { username?: string; profilePicture?: string },
  ) => {
    const response = await fetch(`${API_URL}/auth/update-profile`, {
      method: "PUT",
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return handleResponse(response, "Failed to update profile.");
  },
};

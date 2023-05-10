import axios from "axios";
import { ITokensResponse } from "../authService/types";
import { authService } from "../authService/authService";

const api = axios.create({
  baseURL: import.meta.env.VITE_PARTY_LINK_API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

const getTokens = (): ITokensResponse | null => {
  const tokensAsString = localStorage.getItem('tokens');
  if (tokensAsString) {
    return JSON.parse(tokensAsString) as ITokensResponse
  }
  return null;
}

// Add access token to Authorization header
api.interceptors.request.use(
  async request => {
    const tokens = getTokens();
    if (tokens?.accessToken) {
      request.headers['Authorization'] = `Bearer ${tokens.accessToken}`;
    }
    return request;
  }
);

// Refresh tokens
api.interceptors.response.use(
  async response => response,
  async error => {
    const originalRequest = error.config;
    const authenticateHeader = error.response?.headers["www-authenticate"];

    if (authenticateHeader?.includes("invalid_token") && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const tokens = getTokens();
        if (tokens?.refreshToken) {
          const newTokens = await authService.refresh(tokens.refreshToken);
          localStorage.setItem('tokens', JSON.stringify(newTokens));
          return api(originalRequest);
        }
      }
      catch (err) {
        localStorage.removeItem("tokens");
        window.location.href = window.location.origin;
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
import api from "../instances/api";
import { sha256 } from "../../utils/sha256";
import { ILoginData, ITokensResponse } from "./types";

export const authService = {
  login: async (data: ILoginData) => {
    const response = await api.post<ITokensResponse>("/auth/login", {
      login: data.login,
      passwordHash: await sha256(data.password)
    });
    return response.data;
  },

  logout: async (refreshToken: string) => {
    const response = await api.post("/auth/logout", {
      refreshToken
    });
    return response.data;
  },

  refresh: async (refreshToken: string) => {
    const response = await api.post<ITokensResponse>("/auth/refresh", {
      refreshToken
    });
    return response.data;
  }
}
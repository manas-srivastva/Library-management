import api from "./client";
import {
  ApiResponse,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  User,
} from "@/types/auth";

export const authApi = {
  login: async (payload: LoginPayload) => {
    const { data } = await api.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      payload
    );

    return data;
  },

  register: async (payload: RegisterPayload) => {
    const { data } = await api.post<ApiResponse<User>>(
      "/auth/register",
      payload
    );

    return data;
  },

  me: async () => {
    const { data } = await api.get<ApiResponse<User>>("/auth/me");

    return data;
  },
};
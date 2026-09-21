import { apiClient } from "./client";

import type {
  AuthResponse,
  LoginData,
  RegisterData,
  User,
} from "@/src/types/auth";

export async function register(
  data: RegisterData,
): Promise<AuthResponse> {
  return apiClient<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function login(
  data: LoginData,
): Promise<AuthResponse> {
  return apiClient<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function logout(token: string): Promise<void> {
  await apiClient("/auth/logout", {
    method: "POST",
    token,
  });
}

export async function getCurrentUser(
  token: string,
): Promise<User> {
  return apiClient<User>("/auth/me", {
    method: "GET",
    token,
  });
}
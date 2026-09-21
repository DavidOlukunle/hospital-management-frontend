"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  useState,
  type ReactNode,
} from "react";

import {
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
} from "@/src/lib/api/auth";

import type {
  LoginData,
  RegisterData,
  User,
} from "@/src/types/auth";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

const TOKEN_KEY = "carepoint_token";
const USER_KEY = "carepoint_user";

function subscribeToStorage() {
  return () => {};
}

function getTokenSnapshot(): string | null {
  return window.localStorage.getItem(TOKEN_KEY);
}

function getUserSnapshot(): string | null {
  return window.localStorage.getItem(USER_KEY);
}

function getServerSnapshot(): null {
  return null;
}

function parseUser(value: string | null): User | null {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as User;
  } catch {
    return null;
  }
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const storedToken = useSyncExternalStore(
    subscribeToStorage,
    getTokenSnapshot,
    getServerSnapshot,
  );

  const storedUser = useSyncExternalStore(
    subscribeToStorage,
    getUserSnapshot,
    getServerSnapshot,
  );

  const [localToken, setLocalToken] = useState<string | null>(
    null,
  );

  const [localUser, setLocalUser] = useState<User | null>(
    null,
  );

  const token = localToken ?? storedToken;
  const user = localUser ?? parseUser(storedUser);

  async function login(data: LoginData) {
    const response = await loginRequest(data);

    window.localStorage.setItem(TOKEN_KEY, response.token);
    window.localStorage.setItem(
      USER_KEY,
      JSON.stringify(response.user),
    );

    setLocalToken(response.token);
    setLocalUser(response.user);

    return response.user;
  }

  async function register(data: RegisterData) {
    const response = await registerRequest(data);

    window.localStorage.setItem(TOKEN_KEY, response.token);
    window.localStorage.setItem(
      USER_KEY,
      JSON.stringify(response.user),
    );

    setLocalToken(response.token);
    setLocalUser(response.user);

    return response.user;
  }

  async function logout() {
    if (token) {
      try {
        await logoutRequest(token);
      } catch {
        // Clear the local session even if the API request fails.
      }
    }

    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);

    setLocalToken(null);
    setLocalUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: user !== null && token !== null,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider",
    );
  }

  return context;
}
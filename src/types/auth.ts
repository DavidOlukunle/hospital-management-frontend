export type UserRole = "PATIENT" | "SPECIALIST" | "ADMIN";

export type UserStatus = "ACTIVE" | "SUSPENDED";

export type User = {
  public_id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  profile_image: string | null;
};

export type AuthResponse = {
  user: User;
  token: string;
};

export type RegisterData = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export type LoginData = {
  email: string;
  password: string;
};
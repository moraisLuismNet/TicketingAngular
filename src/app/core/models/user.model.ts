export enum UserRole {
  Customer = 0,
  Agent = 1,
  Admin = 2
}

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}

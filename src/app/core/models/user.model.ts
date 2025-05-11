export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  membershipNumber?: string;
  createdAt: string;
  lastLogin?: string;
}

export enum UserRole {
  ADMIN = 'admin',
  MEMBER = 'member',
  ROLE_ADMIN = "ROLE_ADMIN"
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface RegisterUser {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
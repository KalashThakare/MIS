import { User } from "../user/user.types";

export type AuthUser = User;

export interface JwtPayload {
  sub: string;
  email: string;
}

export interface RegisterInput {
  email: string;
  name: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface PublicAuthUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: "Bearer";
  user: PublicAuthUser;
}

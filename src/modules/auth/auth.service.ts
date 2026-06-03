import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../../config/env";
import { AppError } from "../../shared/errors/AppError";
import { AuthRepository } from "./auth.repository";
import { AuthResponse, AuthUser, JwtPayload, LoginInput, PublicAuthUser, RegisterInput } from "./auth.types";

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async register(input: RegisterInput): Promise<AuthResponse> {
    const email = input.email?.trim().toLowerCase();
    const name = input.name?.trim();

    const existingUser = await this.authRepository.findByEmail(email);

    if (existingUser) {
      throw new AppError("Email is already registered.", 409);
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await this.authRepository.create({ email, name, passwordHash });

    return this.createAuthResponse(user);
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await this.authRepository.findByEmail(input.email?.trim().toLowerCase() ?? "");

    if (!user) {
      throw new AppError("Invalid email or password.", 401);
    }

    const passwordMatches = await bcrypt.compare(input.password ?? "", user.passwordHash);

    if (!passwordMatches) {
      throw new AppError("Invalid email or password.", 401);
    }

    return this.createAuthResponse(user);
  }

  async getCurrentUser(userId: string): Promise<PublicAuthUser> {
    const user = await this.authRepository.findById(userId);

    if (!user) {
      throw new AppError("Authenticated user no longer exists.", 401);
    }

    return this.toPublicUser(user);
  }

  private createAuthResponse(user: AuthUser): AuthResponse {
    return {
      accessToken: this.signToken(user),
      tokenType: "Bearer",
      user: this.toPublicUser(user)
    };
  }

  private signToken(user: AuthUser): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email
    };
    const options: SignOptions = {
      expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"]
    };

    return jwt.sign(payload, env.jwtSecret, options);
  }

  private toPublicUser(user: AuthUser): PublicAuthUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name
    };
  }
}

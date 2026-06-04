import { describe, expect, it, vi } from "vitest";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";

vi.mock("../../config/env", () => ({
  env: {
    jwtExpiresIn: "1d",
    jwtSecret: "test-secret",
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    compare: vi.fn(),
  },
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn(),
  },
}));

const createRepository = () => ({
  findByEmail: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
}) as unknown as AuthRepository;

describe("AuthService", () => {
  it("logs in with normalized email and returns a bearer token plus public user", async () => {
    const repository = createRepository();
    const service = new AuthService(repository);

    vi.mocked(repository.findByEmail).mockResolvedValue({
      id: "user-id",
      email: "user@example.com",
      name: "User Name",
      passwordHash: "secret-hash",
      createdAt: new Date(),
    });
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
    vi.mocked(jwt.sign).mockReturnValue("signed-token" as never);

    await expect(service.login({
      email: " USER@example.com ",
      password: "password",
    })).resolves.toEqual({
      accessToken: "signed-token",
      tokenType: "Bearer",
      user: {
        id: "user-id",
        email: "user@example.com",
        name: "User Name",
      },
    });

    expect(repository.findByEmail).toHaveBeenCalledWith("user@example.com");
    expect(bcrypt.compare).toHaveBeenCalledWith("password", "secret-hash");
    expect(jwt.sign).toHaveBeenCalledWith(
      { sub: "user-id", email: "user@example.com" },
      "test-secret",
      { expiresIn: "1d" }
    );
  });

  it("rejects login when the password does not match", async () => {
    const repository = createRepository();
    const service = new AuthService(repository);

    vi.mocked(repository.findByEmail).mockResolvedValue({
      id: "user-id",
      email: "user@example.com",
      name: "User Name",
      passwordHash: "secret-hash",
      createdAt: new Date(),
    });
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

    await expect(service.login({
      email: "user@example.com",
      password: "wrong-password",
    })).rejects.toMatchObject({
      statusCode: 401,
      message: "Invalid email or password.",
    });
  });
});

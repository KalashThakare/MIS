export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: Date;
}

export type CreateUserInput = Omit<User, "id" | "createdAt">;

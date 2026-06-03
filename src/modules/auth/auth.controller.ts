import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async register(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const authResponse = await this.authService.register(request.body);

      response.status(201).json(authResponse);
    } catch (error) {
      next(error);
    }
  }

  async login(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const authResponse = await this.authService.login(request.body);

      response.status(200).json(authResponse);
    } catch (error) {
      next(error);
    }
  }

  async me(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this.authService.getCurrentUser(request.user!.id);

      response.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }
}

import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async register(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const authResponse = await this.authService.register(request.body);

      response.success(authResponse, 201);
    } catch (error) {
      next(error);
    }
  }

  async login(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const authResponse = await this.authService.login(request.body);

      response.success(authResponse);
    } catch (error) {
      next(error);
    }
  }

  async me(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this.authService.getCurrentUser(request.user!.id);

      response.success({ user });
    } catch (error) {
      next(error);
    }
  }
}

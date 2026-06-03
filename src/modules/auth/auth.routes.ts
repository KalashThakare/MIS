import { Router } from "express";
import { authenticate } from "../../shared/middleware/authenticate";
import { AuthController } from "./auth.controller";
import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";
import { validateLogin, validateRegister } from "./auth.validation";

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

export const authRoutes = Router();

authRoutes.post("/auth/register", validateRegister, authController.register.bind(authController));
authRoutes.post("/auth/login", validateLogin, authController.login.bind(authController));
authRoutes.get("/auth/me", authenticate, authController.me.bind(authController));

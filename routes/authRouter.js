import express from "express";

import validateBody from "../helpers/validateBody.js";
import authServices from "../controllers/authControler.js";
import { registerSchema, loginSchema } from "../schemas/userSchema.js";
import {auth} from "../middlewares/auth.js"

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), authServices.registerUser);

authRouter.post("/login", validateBody(loginSchema), authServices.login);

authRouter.post("/logout", auth, authServices.logout);

authRouter.post("/refresh", auth, authServices.refreshToken);

// authRouter.get("/google", authServices.googleAuth);

// authRouter.get("/google-redirect", authServices.googleRedirect);

export default authRouter;

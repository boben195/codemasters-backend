import express from "express";

import validateBody from "../helpers/validateBody.js";
import authServices from "../controllers/authControler.js";
import {registerSchema, loginSchema, verifyEmailSchema} from "../schemas/userSchema.js";
import {auth} from "../middlewares/auth.js"

/* endpoint: /auth */
const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), authServices.registerUser);

authRouter.post("/login", validateBody(loginSchema), authServices.login);

authRouter.post("/logout", auth, authServices.logout);

authRouter.post("/refresh", auth, authServices.refreshToken);

authRouter.get('/verify/:verificationToken', authServices.verificationEmail);
authRouter.post('/verify', validateBody(verifyEmailSchema), authServices.resendVerificationEmail);

export default authRouter;

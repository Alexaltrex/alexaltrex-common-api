import {Router} from "express";
import {authController} from "../../controllers/auth-sessions/auth.controller";
import { verificationRegister } from "../../middlewares/auth-sessions/verificationRegister";

export const authRouter = Router();
authRouter.post("/registration", [ verificationRegister ], authController.registration);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);
authRouter.get("/userinfo", authController.userInfo);
authRouter.get("/counter", authController.counter);


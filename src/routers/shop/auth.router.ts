import express from 'express';
import {verificationRegister} from "../../middlewares/shop/verificationRegister";
import {authController} from "../../controllers/shop/auth.controller";
import {authUserJwt} from "../../middlewares/shop/authUserJwt";

export const authRouter = express.Router();
authRouter.post('/register', [ verificationRegister ], authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/password', [authUserJwt], authController.changePassword);
authRouter.put('/nickname', [authUserJwt], authController.changeNickname);
authRouter.get('/nickname', [authUserJwt], authController.getNickname);

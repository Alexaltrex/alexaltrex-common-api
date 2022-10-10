import express from 'express';
import {verificationRegister} from "../../middlewares/gzhatsk/verificationRegister";
import {authController} from "../../controllers/gzhatsk/auth.controller";
import {upload} from "../../multer/multer";
import {accessTokenHandler} from "../../middlewares/gzhatsk/accessTokenHandler";

export const gzhatskAuthRouter = express.Router();
gzhatskAuthRouter.post('/register', [ verificationRegister ], authController.register);
gzhatskAuthRouter.post('/login', authController.login);
gzhatskAuthRouter.get('/activate/:link', authController.activate);
gzhatskAuthRouter.get('/refresh', authController.refresh); // запрос нового access token
gzhatskAuthRouter.get('/logout', [ accessTokenHandler ], authController.logout);

gzhatskAuthRouter.get('/users', authController.getUsers); // test
gzhatskAuthRouter.post('/password', [accessTokenHandler], authController.changePassword);
gzhatskAuthRouter.get('/info', [accessTokenHandler], authController.getUserInfo);
gzhatskAuthRouter.put('/nickname', [accessTokenHandler], authController.changeNickname);
gzhatskAuthRouter.put('/avatar', [accessTokenHandler], upload.single('file'), authController.changeAvatar);

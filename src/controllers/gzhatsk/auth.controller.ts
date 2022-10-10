import {NextFunction, Request, Response} from "express";
import {userDB} from "../../db/gzhatsk/auth/UserDB";
import {authService, LoginReturnData} from "../../Services/gzhatsk/auth.service";

export const authController = {
    //============= REGISTER ================
    register: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // данные из клиента
            const registerData = req.body;
            await authService.register(registerData);

            // ответ
            res.status(201).json({
                status: 'ok',
                data: {},
                message: `Пользователь зарегистрирован. На вашу почту ${registerData.email} отправлено письмо со ссылкой. Перейдите по ней для завершения процесса активации аккаунта.`
            });
        } catch (e) {
            next(e)
        }
    },

    //============== LOGIN ==================
    login: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const loginData = req.body; // данные из клиента
            const {accessToken, refreshToken, userId}: LoginReturnData = await authService.login(loginData);

            // сохраняем refreshToken в куке
            res.cookie('refreshToken', refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000, // срок жизни куки
                httpOnly: true,
                sameSite: 'none',
                secure: true
            });

            // ответ
            res.json({
                status: 'ok',
                data: {
                    accessToken,
                    userId,
                },
                message: 'User login'
            });
        } catch (e) {
            next(e)
        }
    },

    //============== LOGOUT =============//
    logout: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            // @ts-ignore
            const userId = req.userId;

            authService.logout(userId);

            // удаляем refreshToken в куке
            res.clearCookie('refreshToken');

            res.status(200).json({
                status: 'ok',
                data: {},
                message: 'User logout'
            });
        } catch (e) {
            next(e)
        }
    },

    //============== ACTIVATE =============//
    activate: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const activationLink = req.params.link;
            authService.activate(activationLink);

            // перенаправляем юзера на фронтенд, страницу с логинизацией
            return res.redirect(
                process.env.NODE_ENV === "production" ? "https://alexaltrex.github.io/OldGzhatsk/#/login" : "http://localhost:3000/OldGzhatsk#/login"
            );

        } catch (e: any) {
            next(e)
        }
    },

    //============== REFRESH =============//
    refresh: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            const accessToken = await authService.refresh(refreshToken);

            res.status(200).json({
                status: 'ok',
                data: {
                    accessToken
                },
                message: 'User refresh success'
            });

        } catch (e) {
            next(e);
        }
    },

    //============== CHANGE PASSWORD ==================
    changePassword: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {oldPassword, newPassword} = req.body; // данные из клиента
            // @ts-ignore
            const userId = req.userId;

            await authService.changePassword({oldPassword, newPassword, userId});

            // ответ
            res.json({
                status: 'ok',
                data: {},
                message: 'Password successfully changed'
            });
        } catch (e) {
            next(e);
        }
    },

    //============== GET USER INFO ==================
    getUserInfo: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // @ts-ignore
            const userId = req.userId;

            const userInfo = authService.getUserInfo(userId);

            res.json({
                status: 'ok',
                data: userInfo,
                message: ''
            });
        } catch (e) {
            next(e);
        }
    },

    //============== CHANGE NICKNAME ==================
    changeNickname: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // @ts-ignore
            const userId = req.userId;
            const nickName = req.body.nickName;

            authService.changeNickname(userId, nickName);

            res.json({
                status: 'ok',
                data: {},
                message: 'NickName successfully changed'
            });

        } catch (e) {
            next(e);
        }
    },

    //============== CHANGE AVATAR ==================
    changeAvatar: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // @ts-ignore
            const userId = req.userId;
            // @ts-ignore
            const file = req.file;

            await authService.changeAvatar(userId, file);

            res.json({
                status: 'ok',
                data: {},
                message: 'Avatar successfully changed'
            });

        } catch (e) {
            next(e);
        }
    },

    //============== GET USERS (TEST) ==================
    getUsers: async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.json({
                status: 'ok',
                data: userDB.getAll(),
                message: ''
            });
        } catch (e) {
            next(e);
        }
    }
}
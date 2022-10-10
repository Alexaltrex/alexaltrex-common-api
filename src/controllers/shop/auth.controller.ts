import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {userDB} from "../../db/shop/UserDB";
import {Request, Response} from "express";
import {JWT_SECRET_SHOP} from "../../const/const";

export const authController = {
    //============= GET ALL USERS (TEST) ================
    getAllUsers: (req: Request, res: Response) => {
        try {
            const users = userDB.getAll();
            res.status(200).json({
                status: 'ok',
                data: users,
                message: ''
            });
        } catch (e) {
            res.status(500).json({
                status: 'error',
                data: {},
                message: 'Internal Server Error'
            })
        }
    },
    //============= REGISTER ================
    register: async (req: Request, res: Response) => {
        try {
            const {login, email, password} = req.body; // данные из клиента
            // хэширование пароля
            const hashPassword = await bcrypt.hash(password, 8);
            // создание и сохранение user в БД
            userDB.add({login, email, password: hashPassword});
            res.status(201).json({
                status: 'ok',
                data: {},
                message: 'Пользователь зарегистрирован'
            });
        } catch (e) {
            res.status(500).json({
                status: 'error',
                data: {},
                message: 'Internal Server Error'
            })
        }
    },
    //============== LOGIN ==================
    async login(req: Request, res: Response) {
        try {
            const {email, password} = req.body; // данные из клиента

            // поиск зарегестрированного пользователя по email
            const user = userDB.findByKeyAndValue("email", email);
            if (!user) {
                return res.status(401).json({
                    status: 'error',
                    data: {},
                    message: 'Unauthorized'
                });
            }
            // проверка совпадения паролей
            const passwordIsMatch = await bcrypt.compare(password, user.password);
            if (!passwordIsMatch) {
                return res.status(401).json({
                    status: 'error',
                    data: {},
                    message: 'Unauthorized'
                });
            }
            // создание токена
            const token = jwt.sign(
                {
                    userId: user.id,
                    role: user.role,
                    login: user.login,
                },
                JWT_SECRET_SHOP as string,
                //{expiresIn: '1h'}
            );
            res.json({
                status: 'ok',
                data: {
                    token,
                    userId: user.id,
                    login: user.login,
                    role: user.role,
                    email: user.email,
                },
                message: ''
            });
        } catch (e) {
            res.status(500).json({
                status: 'error',
                data: {},
                message: 'Internal Server Error'
            })
        }
    },
    //============== CHANGE PASSWORD ==================
    async changePassword(req: Request, res: Response) {
        try {
            const {oldPassword, newPassword} = req.body; // данные из клиента
            // @ts-ignore
            const userId = req.userId;
            const user = userDB.findByKeyAndValue("id", userId);
            if (!user) {
                return res.status(401).json({
                    status: 'error',
                    data: {},
                    message: 'Unauthorized - no user'
                });
            }
            // проверка совпадения паролей
            const passwordIsMatch = await bcrypt.compare(oldPassword, user.password);
            if (!passwordIsMatch) {
                return res.status(401).json({
                    status: 'error',
                    data: {},
                    message: 'Unauthorized - password is not match'
                });
            }
            const hashPassword = await bcrypt.hash(newPassword, 8);
            userDB.changePassword(userId, hashPassword);
            return res.json({
                status: 'ok',
                data: {},
                message: 'Password successfully changed'
            });
        } catch (e) {
            res.status(500).json({
                status: 'error',
                data: {},
                message: 'Internal Server Error'
            })
        }
    },
    //============== CHANGE NICKNAME ==================
    async changeNickname(req: Request, res: Response) {
        try {
            // @ts-ignore
            const userId = req.userId;
            const nickName = req.body.nickName;
            userDB.changeNickname(userId, nickName);

            return res.json({
                status: 'ok',
                data: {},
                message: 'NickName successfully changed'
            });

        } catch (e) {
            res.status(500).json({
                status: 'error',
                data: {},
                message: 'Internal Server Error'
            })
        }
    },
    //============== GET NICKNAME ==================
    async getNickname(req: Request, res: Response) {
        try {
            // @ts-ignore
            const userId = req.userId;
            const nickName = userDB.getNickname(userId);

            return res.json({
                status: 'ok',
                data: nickName,
                message: ''
            });

        } catch (e) {
            res.status(500).json({
                status: 'error',
                data: {},
                message: 'Internal Server Error'
            })
        }
    },
};
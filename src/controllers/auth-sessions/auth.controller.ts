import {NextFunction, Request, Response} from "express";
import bcrypt from "bcryptjs";
import {LoginType, RegistrationType} from "../../interfaces/auth-sessions.types";
import {userDB} from "../../db/auth-session/UserDB";
import {ApiError} from "../../middlewares/errorHandler";
import {Session} from "express-session";


export const authController = {
    //============= REGISTRATION ================
    registration: async (req: Request<any, any, RegistrationType>, res: Response, next: NextFunction) => {
        try {
            // данные из клиента
            const {login, email, password} = req.body;
            console.log(login, email, password)

            // хэширование пароля
            const hashPassword = await bcrypt.hash(password, 8);

            // создание и сохранение user в БД
            userDB.add({login, email, password: hashPassword});


            res.status(201).json({
                status: 'ok',
                data: {},
                message: "User registered success"
            });
        } catch (e) {
            next(e)
        }
    },
    //============= LOGIN ================
    login: async (req: Request<any, any, LoginType>, res: Response, next: NextFunction) => {
        try {
            const {email, password} = req.body; // данные из клиента
            console.log(email, password)

            // поиск зарегестрированного пользователя по email
            const user = userDB.findByKeyAndValue("email", email);
            if (!user) {
                throw ApiError.UnauthorizedError()
            }

            // проверка совпадения паролей
            const passwordIsMatch = await bcrypt.compare(password, user.password);
            if (!passwordIsMatch) {
                throw ApiError.UnauthorizedError();
            }

            // @ts-ignore
            //req.session.userId = user.id;

            res.json({
                status: 'ok',
                data: {},
                message: 'User login success'
            });
        } catch (e) {
            next(e)
        }
    },
    //============= LOGIN ================
    logout: async (req: Request, res: Response, next: NextFunction) => {
        try {
            //const session = req.session as Session & {userId: string | undefined }
            req.session.destroy((err: any) => {
                console.log(err)
            });
            res.json({
                status: 'ok',
                data: {},
                message: 'User logout success'
            });
        } catch (e) {
            next(e)
        }
    },

    //============= COUNTER ================
    counter: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const session = req.session as Session & {
                userId: string | undefined
                counter: number | undefined
            }
            if (!session.userId) {
                throw ApiError.Forbidden()
            }
            session.counter = session.counter ? session.counter + 1 : 1;

            // console.log(req.session)
            // console.log(req.sessionID)

            res.status(201).json({
                status: 'ok',
                data: session.counter,
                message: ""
            });
        } catch (e) {
            next(e)
        }
    },

    //============= USER INFO ================
    userInfo: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const session = req.session as Session & {userId: string | undefined }
            if (!session.userId) {
                throw ApiError.Forbidden()
            }

            const user = userDB.findByKeyAndValue("id", session.userId);

            if (!user) {
                throw new ApiError(400, "User not found")
            }


            res.status(201).json({
                status: 'ok',
                data: {email: user.email, login: user.login},
                message: ""
            });
        } catch (e) {
            next(e)
        }
    }

}

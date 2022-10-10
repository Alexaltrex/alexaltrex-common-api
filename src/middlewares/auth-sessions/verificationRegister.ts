import {Request, Response, NextFunction} from "express";
import {userDB} from "../../db/auth-session/UserDB";

interface IReqBody {
    login: string
    email: string
}

export const verificationRegister = (req: Request<any, any, IReqBody>, res: Response, next: NextFunction) => {
    try {
        const {login, email} = req.body;

        // проверка на уникальность login
        const candidateByLogin = userDB.findByKeyAndValue("login", login);
        if (candidateByLogin) {
            return res.status(401).json({
                status: 'error',
                data: {},
                message: 'Пользователь с таким login уже зарегистрирован',
                error: {
                    field: 'login',
                    value: 'Пользователь с таким login уже зарегистрирован'
                }
            });
        }
        // проверка на уникальность email
        const candidateByEmail = userDB.findByKeyAndValue("email", email);
        if (candidateByEmail) {
            return res.status(401).json({
                status: 'error',
                data: {},
                message: 'Пользователь с такой email уже зарегестрирован',
                error: {
                    field: 'email',
                    value: 'Пользователь с такой email уже зарегестрирован'
                }
            });
        }
        next();
    } catch (e) {
        next(e)
    }
}

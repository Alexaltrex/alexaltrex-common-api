import {Request, Response, NextFunction} from "express";
import jwt from 'jsonwebtoken';
import {ApiError} from "../errorHandler";
import {IAccessPayload} from "../../helpers/tokens";


export const accessTokenHandler = (req: Request, res: Response, next: NextFunction) => {
    if (req.method === "OPTIONS") {
        next();
    }
    try {
        // достаем accessToken из заголовка запроса
        const accessToken = req.headers['x-access-token'];
        if (!accessToken) {
            throw ApiError.UnauthorizedError();
        }
        // расшифровываем информацию из accessToken
        const jwtAccessPayload = jwt.verify(accessToken as string, process.env.ACCESS_TOKEN_SECRET as string) as IAccessPayload;

        // валидируем jwtAccessPayload
        // if (!jwtAccessPayload) {
        //     throw ApiError.UnauthorizedError();
        // }

        // добавляем инфо из accessToken в request
        // @ts-ignore
        req.userId = jwtAccessPayload.userId;
        next();
    } catch (e: any) {
        if (e.name === "TokenExpiredError") {
            throw ApiError.TokenExpiredError();
        } else {
            throw ApiError.UnauthorizedError();
        }
    }
}
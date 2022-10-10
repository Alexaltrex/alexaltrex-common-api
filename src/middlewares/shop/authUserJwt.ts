import jwt from 'jsonwebtoken';
import {Request, Response, NextFunction} from "express";
import {IDecodedData} from "../../interfaces/shop-interfaces";
import {JWT_SECRET_SHOP} from "../../const/const";

export const authUserJwt = (req: Request, res: Response, next: NextFunction) => {
    if (req.method === "OPTIONS") {
        next();
    }
    try {
        const token = req.headers['x-access-token'];
        if (!token) {
            return res.status(401).json({
                status: 'error',
                data: {},
                message: "Unauthorized"
            });
            return;
        }
        const decodedData = jwt.verify(token as string, JWT_SECRET_SHOP as string) as IDecodedData;
        // @ts-ignore
        req.userId = decodedData.userId;
        // @ts-ignore
        req.login = decodedData.login;
        next();
    } catch (e) {
        console.log(e);
        return res.status(401).json({
            status: 'error',
            data: {},
            message: "Unauthorized"
        })
    }
}
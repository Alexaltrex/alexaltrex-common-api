import jwt from 'jsonwebtoken';
import {Request, Response, NextFunction} from "express";
import {IDecodedData} from "../../interfaces/gzhatsk/auth.interface";
import {JWT_SECRET_SHOP} from "../../const/const";

export const authAdminJwt = (req: Request, res: Response, next: NextFunction) => {
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
        }
        const decodedData = jwt.verify(token as string, JWT_SECRET_SHOP as string) as IDecodedData;

        if (decodedData.role !== "admin") {
            return res.status(401).json({
                status: 'error',
                data: {},
                message: "Unauthorized"
            });
        }
        //req.userId = decodedData.userId;
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
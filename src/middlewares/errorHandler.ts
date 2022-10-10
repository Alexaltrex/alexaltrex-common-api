import {NextFunction, Request, Response} from "express";

export class ApiError extends Error {
    public status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }

    public static UnauthorizedError() {
        return new ApiError(401, "Пользователь не авторизован");
    }

    public static NotActivatedError() {
        return new ApiError(401, "Профиль не активировен");
    }

    public static BadRequest(message: string) {
        return new ApiError(400, message);
    }

    public static TokenExpiredError() {
        return new ApiError(401, "Token Expired Error");
    }

    public static Forbidden() {
        return new ApiError(403, "Forbidden Error");
    }
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err.message);
    //console.log(err.stack);
    console.log(err.name);

    if (err instanceof ApiError) {
        return res.status(err.status).json({
            status: 'error',
            data: err,
            message: err.message
        })
    }

    res.status(500).json({
        status: 'error',
        data: err,
        message: 'Internal Server Error'
    });
}

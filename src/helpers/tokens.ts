import jwt from 'jsonwebtoken';

export interface IAccessPayload {
    userId: string
    email: string
    isActivated: boolean
}

export interface IRefreshPayload {
    userId: string
}

export const generateAccessTokens = async (payload: IAccessPayload) => {
    const accessToken = await jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET as string,
        {expiresIn: '30s'} // если не задано живет бесконечно
    );
    return accessToken
}

export const generateRefreshTokens = async (payload: IRefreshPayload) => {
    const refreshToken = await jwt.sign(
        payload,
        process.env.REFRESH_TOKEN_SECRET as string,
        {expiresIn: '30d'}
    );
    return refreshToken
}

// проверка на то что токен не подделан и срок его годности не истёк
export const validateRefreshToken = async (refreshToken: string) => {
    try {
        const jwtPayload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string);
        return jwtPayload as IRefreshPayload
    } catch {
        return null
    }
}
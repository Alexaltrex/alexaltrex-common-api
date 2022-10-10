import {IAvatar, ILoginData, IRegisterData} from "../../interfaces/gzhatsk/auth.interface";
import bcrypt from "bcryptjs";
import {v4 as uuidv4} from "uuid";
import nodemailer from "nodemailer";
import {userDB} from "../../db/gzhatsk/auth/UserDB";
import {ApiError} from "../../middlewares/errorHandler";
import {generateAccessTokens, generateRefreshTokens, validateRefreshToken} from "../../helpers/tokens";
import {refreshTokenDB} from "../../db/gzhatsk/refreshToken/RefreshTokenDB";
import {RoleType} from "../../interfaces/shop-interfaces";
import S3 from "aws-sdk/clients/s3";
import path from "path";

export interface LoginReturnData {
    accessToken: string
    refreshToken: string
    userId: string
}

export interface IChangePassword {
    oldPassword: string
    newPassword: string
    userId: string
}

export interface IUserInfo {
    login: string
    email: string
    role: RoleType
    nickName: string
    avatar: IAvatar | null
}

export const authService = {
    //============= REGISTER ================
    register: async ({login, email, password}: IRegisterData): Promise<void> => {

        // хэширование пароля
        const hashPassword = await bcrypt.hash(password, 8);

        // ссылка для активации
        const activationLink = uuidv4();
        const link = `${
            process.env.NODE_ENV === "production"
                ? "https://alexaltrex-common-api.herokuapp.com/gzhatsk/"
                : "http://localhost:4444/gzhatsk/"
        }auth/activate/${activationLink}`;

        // отправляем на почту пользователя ссылку с активацией
        const transporter = nodemailer.createTransport({
            host: 'smtp.mail.ru',
            port: 465,
            secure: true,
            auth: {
                user: "alexaltrex-old-gzhatsk@mail.ru",
                pass: "57xCY8QGLsgDw3ZMD8Yf",
            }
        });
        await transporter.sendMail({
            from: "alexaltrex-old-gzhatsk@mail.ru",
            to: email,
            subject: `Активация аккаунта на ${
                process.env.NODE_ENV === "production" ? "https://alexaltrex.github.io/OldGzhatsk/" : "http://localhost:3000/OldGzhatsk"
            }`,
            text: "",
            html:
                `
                <div>
                        <h3>Для активации аккаунта перейдите по ссылке</h3>
                        <a href="${link}">Ссылка для активации аккаунта</a>
                </div>
                `
        });

        // создание и сохранение user в БД
        userDB.add({login, email, password: hashPassword, activationLink});
    },

    //============== LOGIN ==================
    login: async ({email, password}: ILoginData): Promise<LoginReturnData> => {

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

        // проверка на активацию профиля
        if (!user.isActivated) {
            throw ApiError.NotActivatedError();
        }

        // генерация токенов
        // accessTokens - возвращаем в ответе на фронт
        // refreshToken - сохраняем в БД и записываем в куку ответа с httpOnly
        const accessToken = await generateAccessTokens({
            userId: user.id,
            email: user.email,
            isActivated: user.isActivated
        });
        const refreshToken = await generateRefreshTokens({
            userId: user.id,
        });

        // сохраняем refreshToken в базе данных
        refreshTokenDB.save(user.id, refreshToken);

        return {accessToken, refreshToken, userId: user.id};
    },

    //============== LOGOUT =============//
    logout: (userId: string): void => {
        // удаляем refreshToken из бд
        refreshTokenDB.delete(userId);
    },

    //============== ACTIVATE =============//
    activate: (activationLink: string): void => {

        // проверка на существование user с такой activationLink
        const userCandidate = userDB.findByKeyAndValue("activationLink", activationLink);
        if (!userCandidate) {
            throw ApiError.BadRequest('Некорректная ссылка активации');
        }

        // isActivated = true
        userDB.activateUser(userCandidate.id);
    },

    //============== REFRESH =============//
    refresh: async (refreshToken: string): Promise<string> => {

        // console.log(`refreshToken = ${refreshToken}`);
        // проверка токена на null, undefined
        if (!refreshToken) {
            throw  ApiError.UnauthorizedError();
        }

        // валидация refreshToken
        const jwtPayload = await validateRefreshToken(refreshToken);
        console.log(`jwtPayload = ${jwtPayload}`);
        if (!jwtPayload) {
            throw ApiError.UnauthorizedError();
        }

        // проверка на наличие refreshToken в БД
        const refreshTokenFromDB = refreshTokenDB.getById(jwtPayload.userId);
        // console.log(`refreshTokenFromDB = ${refreshTokenFromDB}`);
        if (!refreshTokenFromDB) {
            throw ApiError.UnauthorizedError();
        }

        // генерируем новый accessToken
        const userFromDB = userDB.getById(jwtPayload.userId);
        const accessToken = await generateAccessTokens({
            userId: userFromDB.id,
            email: userFromDB.email,
            isActivated: userFromDB.isActivated
        });

        return accessToken;
    },

    //============== CHANGE PASSWORD =================//
    changePassword: async ({oldPassword, newPassword, userId}: IChangePassword): Promise<void> => {

        // поиск пользователя в БД
        const user = userDB.getById(userId);
        if (!user) {
            throw ApiError.BadRequest("User not found");
        }

        // проверка совпадения паролей
        const passwordIsMatch = await bcrypt.compare(oldPassword, user.password);
        if (!passwordIsMatch) {
            if (!user) {
                throw ApiError.BadRequest("Password is not match");
            }
        }

        // сохраняем новый пароль в БД
        const hashPassword = await bcrypt.hash(newPassword, 8);
        userDB.changePassword(userId, hashPassword);
    },

    //============== GET USER INFO ==================
    getUserInfo: (userId: string): IUserInfo => {
        // поиск пользователя в БД
        const user = userDB.getById(userId);
        if (!user) {
            throw ApiError.BadRequest("User not found");
        }

        const userInfo = {
            login: user.login,
            email: user.email,
            role: user.role,
            nickName: user.nickName,
            avatar: user.avatar
        }

        return userInfo
    },

    //============== CHANGE NICKNAME ================//
    changeNickname: (userId: string, nickName: string): void => {
        userDB.changeNickname(userId, nickName);
    },

    //============== CHANGE AVATAR ==================
    changeAvatar: async (userId: string, file: Express.Multer.File | undefined): Promise<void> => {

        // загрузка файла на amazon aws s3
        const s3 = new S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION
        });
        if (file) {
            const extName = path.extname(file.originalname); // расширение
            const keyName = `avatar/${userId}${extName}`; // полный путь к файлу: папка/[имя].[расширение]
            const params = {
                Bucket: process.env.S3_BUCKET_NAME, // название корзины
                Key: keyName, // полный путь к файлу: папка/[имя].[расширение]
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: "public-read"
            }
            // @ts-ignore
            const fileS3 = await s3.upload(params).promise();
            // ETag: '"dcc36ea6c44c12aedacf18feb0f9c5bf"',
            // Location: 'https://old-gzhatsk.s3.amazonaws.com/avatar/aid9jsgq1gsmyme89g59.jpg',
            // key: 'avatar/aid9jsgq1gsmyme89g59.jpg',
            // Key: 'avatar/aid9jsgq1gsmyme89g59.jpg',
            // Bucket: 'old-gzhatsk'

            // сохраняем путь к файлу из S3 в локальную базу данных
            userDB.setAvatar(userId, fileS3.Location);
        }
    },
}

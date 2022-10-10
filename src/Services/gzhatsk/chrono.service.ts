import {chronoDB} from "../../db/gzhatsk/chrono/chronoDB";
import S3 from "aws-sdk/clients/s3";
import path from "path";
import {v4 as uuidv4} from "uuid";
import {ApiError} from "../../middlewares/errorHandler";
import {
    ChronoItemUpdateDBType,
    ChronoItemUpdateOnlyTextType,
    IChronoItem
} from "../../interfaces/gzhatsk/chrono.interfaces";
import {userDB} from "../../db/gzhatsk/auth/UserDB";
import {RoleEnum} from "../../interfaces/gzhatsk/auth.interface";

interface IUpdateChronoItem {
    date: string
    text: string
    fullText: string
    createdByUserId: string
}

export const chronoService = {
    //============= GET ALL ===============//
    getAll: (): IChronoItem[] => {
        const items = chronoDB.getAll();
        return items;
    },

    //============= UPDATE =============//
    update: async (
        chronoId: string,
        userId: string,
        update: ChronoItemUpdateOnlyTextType,
        file: Express.Multer.File | undefined
    ): Promise<IChronoItem> => {
        const chronoItem = chronoDB.getById(chronoId);
        const user = userDB.getById(userId);

        // обновлять может только 1. тот, кто создавал; 2. пользователь с ролью "admin"
        if (userId !== chronoItem.createdByUserId && user.role !== RoleEnum.admin) {
            throw ApiError.UnauthorizedError();
        }

        const updateDB = {...update} as ChronoItemUpdateDBType;

        // загрузка файла на amazon aws s3
        if (file) {
            const s3 = new S3({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                region: process.env.AWS_REGION
            });
            const extName = path.extname(file.originalname); // расширение
            const keyName = `chrono/${chronoId}${extName}`; // полный путь к файлу: папка/[имя].[расширение]
            const params = {
                Bucket: process.env.S3_BUCKET_NAME, // название корзины
                Key: keyName, // полный путь к файлу: папка/[имя].[расширение]
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: "public-read"
            }
            // путь к файлу из S3
            // @ts-ignore
            const fileS3 = await s3.upload(params).promise();
            updateDB.src = fileS3.Location;
        }
        const chronoItemUpdated = chronoDB.update(chronoId, updateDB);
        return chronoItemUpdated;
    },

    //============= ADD =============//
    add: async (
        userId: string,
        update: ChronoItemUpdateOnlyTextType,
        file: Express.Multer.File | undefined
    ): Promise<IChronoItem> => {
        const chronoId = uuidv4();
        let src = '';

        // загрузка файла на amazon aws s3
        if (file) {
            const s3 = new S3({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                region: process.env.AWS_REGION
            });
            const extName = path.extname(file.originalname); // расширение
            const keyName = `chrono/${chronoId}${extName}`; // полный путь к файлу: папка/[имя].[расширение]
            const params = {
                Bucket: process.env.S3_BUCKET_NAME, // название корзины
                Key: keyName, // полный путь к файлу: папка/[имя].[расширение]
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: "public-read"
            }
            // путь к файлу из S3
            // @ts-ignore
            const fileS3 = await s3.upload(params).promise();
            src = fileS3.Location;
        }
        const updateItem: IChronoItem = {id: chronoId, src, createdByUserId: userId, ...update}
        const chronoItemUpdated = chronoDB.add(updateItem);
        return chronoItemUpdated;
    },

    //============= DELETE =============//
    delete: (id: string): void => {
        chronoDB.delete(id);
    }
}
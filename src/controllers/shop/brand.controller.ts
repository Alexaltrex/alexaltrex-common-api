import {Request, Response} from "express";
import {brandDB} from "../../db/shop/BrandDB";

export const brandController = {
    //========= GET ALL ==========
    getAll: async (req: Request, res: Response) => {
        try {
            res.status(201).json({
                status: 'ok',
                data: brandDB.getAll(),
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
    //========= ADD ============
    add: async (req: Request, res: Response) => {
        try {
            const {title} = req.body;

            // проверка на уникальность
            const candidate = brandDB.findByTitle(title);

            if (candidate) {
                return res.status(401).json({
                    status: 'error',
                    data: {},
                    message: 'Бренд с таким названием уже существует',
                    error: {
                        field: 'title',
                        value: 'Бренд с таким названием уже существует'
                    }
                });
            }

            brandDB.add(title);
            res.status(201).json({
                status: 'ok',
                data: {},
                message: 'Бренд создан'
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
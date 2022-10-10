import {Request, Response} from "express";
import {categoryDB} from "../../db/shop/CategoryDB";

export const categoryController = {
    //========= GET ALL ==========
    getAll: async (req: Request, res: Response) => {
        try {
            res.status(201).json({
                status: 'ok',
                data: categoryDB.getAll(),
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
    //========= CREATE ============
    create: async (req: Request, res: Response) => {
        try {
            const {title} = req.body;

            // проверка на уникальность
            const candidateByTitle = categoryDB.findByTitle(title);
            if (candidateByTitle) {
                return res.status(401).json({
                    status: 'error',
                    data: {},
                    message: 'Category with this title already exists',
                    error: {
                        field: 'title',
                        value: 'Category with this title already exists'
                    }
                });
            }
            categoryDB.add(title);
            res.status(201).json({
                status: 'ok',
                data: {},
                message: 'Катагория создана'
            });
        } catch (e) {
            res.status(500).json({
                status: 'error',
                data: {},
                message: 'Internal Server Error'
            })
        }
    },
    //========= RENAME ============
    rename: async (req: Request, res: Response) => {
        try {
            const {id, title} = req.body;

            // проверка на уникальность
            const candidateByTitle = categoryDB.findByTitle(title);

            if (candidateByTitle) {
                return res.status(401).json({
                    status: 'error',
                    data: {},
                    message: 'Category with this title already exists',
                    error: {
                        field: 'title',
                        value: 'Category with this title already exists'
                    }
                });
            }
            // если title корректен
            categoryDB.rename(id, title);

            res.status(201).json({
                status: 'ok',
                data: {},
                message: 'Category update'
            });

        } catch (e) {
            res.status(500).json({
                status: 'error',
                data: {},
                message: 'Internal Server Error'
            })
        }
    },

    //========= DELETE ============
    delete: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;

            // проверка на существование
            const candidateById = categoryDB.getById(id);

            if (!candidateById) {
                return res.status(401).json({
                    status: 'error',
                    data: {},
                    message: 'Category does not exist',
                    error: {
                        value: 'Category does not exist'
                    }
                });
            }

            // удаление категории и товаров в ней
            categoryDB.delete(id);
            res.status(201).json({
                status: 'ok',
                data: {},
                message: 'Category deleted'
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
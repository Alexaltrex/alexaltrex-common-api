import {NextFunction, Request, Response} from "express";
import {productDB} from "../../db/rtk-query/ProductDB";


export const productController = {
    //============= GET BY ID ===============//
    getById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const item = productDB.getById(id);
            res.json(item);
        } catch (e) {
            next(e)
        }
    },
    //=============== GET ALL ===============//
    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const items = productDB.getAll();
            res.json(items);
        } catch (e) {
            next(e)
        }
    },
    //============= UPDATE ==============//
    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const productCreate = req.body;
            const updatedProduct = productDB.update(id, productCreate)
            res.json({
                message: "Product updated successfully",
                data: updatedProduct
            });
        } catch (e) {
            next(e)
        }
    },
    //============= CREATE ==============//
    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const productCreate = req.body;
            productDB.create(productCreate)
            res.json("Product created successfully");
        } catch (e) {
            next(e)
        }
    },
    //============= DELETE ==============//
    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            productDB.delete(id);
            res.json("Product deleted successfully");

        } catch (e) {
            next(e)
        }
    },
}
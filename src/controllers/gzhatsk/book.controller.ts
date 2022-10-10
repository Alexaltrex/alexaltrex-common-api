import {NextFunction, Request, Response} from "express";
import {bookService} from "../../Services/gzhatsk/book.service";

export const bookController = {
    //============= GET ALL ===============//
    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const items = bookService.getAll();
            res.json({
                status: 'ok',
                data: items,
                message: 'get all'
            });
        } catch (e) {
            next(e)
        }
    },
}
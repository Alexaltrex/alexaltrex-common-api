import {NextFunction, Request, Response} from "express";
import {markService} from "../../../Services/gzhatsk/mark.service";

export const markController = {
    //========== GET All MARKS =========//
    getAll: (req: Request, res: Response, next: NextFunction) => {
        try {
            const marks = markService.getAll();
            res.json({
                status: 'ok',
                data: marks,
                message: ''
            });
        } catch (e) {
            next(e)
        }
    },
    //========== GET BY ID =========//
    getById: (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const mark = markService.getById(id);
            res.json({
                status: 'ok',
                data: mark,
                message: ''
            });
        } catch (e) {
            next(e)
        }
    }
}
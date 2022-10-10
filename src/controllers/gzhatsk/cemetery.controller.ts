import {NextFunction, Request, Response} from "express";
import {markService} from "../../Services/gzhatsk/mark.service";
import {cemeteryService} from "../../Services/gzhatsk/cemeteriey.service";

export const cemeteryController = {
    getAll: (req: Request, res: Response, next: NextFunction) => {
        try {
            const cemeteries = cemeteryService.getAll();
            res.json(cemeteries);
        } catch (e) {
            next(e)
        }
    },

    getById: (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const cemetery = cemeteryService.getById(id);
            res.json(cemetery);
        } catch (e) {
            next(e)
        }
    }
}
import {NextFunction, Request, Response} from "express";
import {brickDB} from "../../../db/gzhatsk/bricks/BrickDB";

export const brickController = {
    //========== GET BRICKS =========
    getBricks: (req: Request, res: Response, next: NextFunction) => {
        try {
            const {query, marks, fontKind, border, defect} = req.query;

            console.log(query, marks, fontKind, border, defect);
            const bricks = brickDB.getBricks();

            const filteredBricks = bricks.filter(brick => {
                const boolQuery = query ? (new RegExp(query as string)).test(brick.value) : true;
                return boolQuery
            });

            res.json({
                status: 'ok',
                data: {filteredBricks},
                message: ''
            });

        } catch (e) {
            next(e)
        }
    }
}
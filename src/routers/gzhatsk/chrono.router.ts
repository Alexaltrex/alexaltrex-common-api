import {chronoController} from "../../controllers/gzhatsk/chrono.controller";
import {upload} from "../../multer/multer";
import {Router} from "express";
import {accessTokenHandler} from "../../middlewares/gzhatsk/accessTokenHandler";

export const chronoRouter = Router();
chronoRouter.get('/', chronoController.getAll);
chronoRouter.put('/:id', accessTokenHandler, [upload.single('src')], chronoController.update);
chronoRouter.post('/', accessTokenHandler, [upload.single('src')], chronoController.add);
chronoRouter.delete('/:id', accessTokenHandler, chronoController.delete);
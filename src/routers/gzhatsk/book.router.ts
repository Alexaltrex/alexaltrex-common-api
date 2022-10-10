import {Router} from "express";
import {bookController} from "../../controllers/gzhatsk/book.controller";

export const bookRouter = Router();
bookRouter.get('/', bookController.getAll);
import express from 'express';
import {markController} from "../../../controllers/gzhatsk/bricks/mark.controller";
export const markRouter = express.Router();

//========== GET All MARKS =========
markRouter.get('/', markController.getAll);
//========== GET BY ID =========
markRouter.get('/:id', markController.getById);
import express from 'express';
import {brickController} from "../../../controllers/gzhatsk/bricks/brick.controller";
export const brickRouter = express.Router();

//========== GET All MARKS =========
brickRouter.get('/', brickController.getBricks);
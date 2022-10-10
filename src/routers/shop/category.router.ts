import express from 'express';
import {categoryController} from "../../controllers/shop/category.controller";
import {authAdminJwt} from "../../middlewares/shop/authAdminJwt";

export const categoryRouter = express.Router();
categoryRouter.get('/', categoryController.getAll);
categoryRouter.post('/', authAdminJwt, categoryController.create);
categoryRouter.put('/', authAdminJwt, categoryController.rename);
categoryRouter.delete('/:id', authAdminJwt, categoryController.delete);

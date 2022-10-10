import express from 'express';
import {brandController} from "../../controllers/shop/brand.controller";
import {authAdminJwt} from "../../middlewares/shop/authAdminJwt";

export const brandRouter = express.Router();
brandRouter.get('/', brandController.getAll);
brandRouter.post('/', [authAdminJwt], brandController.add);
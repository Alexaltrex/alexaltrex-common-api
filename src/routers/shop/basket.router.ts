import express from 'express';
import {authUserJwt} from "../../middlewares/shop/authUserJwt";
import {basketController} from "../../controllers/shop/basket.controller";

export const basketRouter = express.Router();
//========== GET PRODUCTS FROM BASKET =========
basketRouter.get('/', [authUserJwt], basketController.getProducts);
//========== ADD PRODUCT TO BASKET =========
basketRouter.post('/', [ authUserJwt ], basketController.addProduct);
//========== UPDATE PRODUCT FROM BASKET =========
basketRouter.put('/', [ authUserJwt ], basketController.updateProduct);
//========== DELETE PRODUCT FROM BASKET =========
basketRouter.delete('/:id', [ authUserJwt ], basketController.deleteProduct);


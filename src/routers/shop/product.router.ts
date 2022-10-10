import express from 'express';
import {productController} from "../../controllers/shop/product.controller";
import {authAdminJwt} from "../../middlewares/shop/authAdminJwt";
import {authUserJwt} from "../../middlewares/shop/authUserJwt";

export const productRouter = express.Router();
productRouter.get('/category/:id', productController.getByCategoryId);
productRouter.get('/id/:id', productController.getProductById);
productRouter.delete('/id/:id', authAdminJwt, productController.delete);
productRouter.get('/price', productController.getMinMaxPrice);
productRouter.get('/', productController.getProducts);
productRouter.put('/', authAdminJwt, productController.update);
productRouter.post('/', authAdminJwt, productController.create);
productRouter.get('/review', [authUserJwt], productController.getRatedProducts);
productRouter.post('/review', [authUserJwt], productController.reviewProduct);
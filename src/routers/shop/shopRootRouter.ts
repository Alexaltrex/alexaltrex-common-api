import {Router} from "express";
import {authRouter} from "./auth.router";
import {brandRouter} from "./brand.router";
import {productRouter} from "./product.router";
import {categoryRouter} from "./category.router";
import {basketRouter} from "./basket.router";
import {_populateDB} from "../../db/shop/_populateDB";

export const shopRootRouter = Router();
shopRootRouter.use('/auth', authRouter);
shopRootRouter.use('/brand', brandRouter);
shopRootRouter.use('/product', productRouter);
shopRootRouter.use('/category', categoryRouter);
shopRootRouter.use('/basket', basketRouter);
shopRootRouter.get('/populate', (req,res) => {
    const {brands, products, categories} = _populateDB(5, 10, 10);
    res.json({
        status: 'ok',
        data: {
            b: brands,
            c: categories,
            p: products
        },
        message: ''
    });
});
shopRootRouter.get('/version', (req,res) => {
    res.json({
        status: 'ok',
        data: "09.02.2022, 21:40",
        message: ''
    });
});
shopRootRouter.get('/env', (req,res) => {
    res.json({
        status: 'ok',
        data: process.env.NODE_ENV,
        message: ''
    });
});
import {Router} from "express";
import {productRouter} from "./product.router";

export const rtkQueryRootRouter = Router();
rtkQueryRootRouter.use("/product", productRouter);
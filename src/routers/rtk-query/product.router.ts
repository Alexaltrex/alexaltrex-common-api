import {Router} from "express";
import {productController} from "../../controllers/rtk-query/product.controller";

export const productRouter = Router();

//========== GET All MARKS =========
productRouter.get("/", productController.getAll);
//=========== GET BY ID ============
productRouter.get("/:id", productController.getById);
//============= DELETE =============
productRouter.delete("/:id", productController.delete);
//============= UPDATE =============
productRouter.put("/:id", productController.update);
//============= CREATE =============
productRouter.post("/", productController.create);
import {IProduct, IProducts, ProductCreateType} from "../../interfaces/rtk-query.types";
import { productMock } from "./ProductMock";
import {v4 as uuidv4} from "uuid";

class ProductDB {
    private _products: IProducts = productMock

    public getById(id: string): IProduct {
        return this._products[id]
    }

    public getAll(): IProduct[] {
        return Object.values(this._products)
    }

    public delete(id: string): void {
        delete this._products[id]
    }

    public create(productCreate: ProductCreateType): void {
        const id = uuidv4();
        this._products[id] = {id, ...productCreate}
    }

    public update(id: string, productCreate: ProductCreateType): IProduct {
        const updatedProduct =  this._products[id] = {...this._products[id], ...productCreate}
        return updatedProduct
    }
}
export const productDB = new ProductDB();
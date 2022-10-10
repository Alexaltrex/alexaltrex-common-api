import {categoryMock} from "./categoryMock";
import {IBrand, ICategories, ICategory} from "../../interfaces/shop-interfaces";
import {id} from "../../helpers/helpers";
import {productDB} from "./ProductDB";

class CategoryDB {
    private _categories: ICategories = categoryMock

    public getAll(): ICategory[] {
        return [...Object.values(this._categories)]
    }

    public getById(id: string): ICategory {
        return this._categories[id]
    }

    public add(title: string): void {
        const key = id();
        this._categories[key] = {
            id: key,
            title,
            products: [] // массив ид продуктов
        }
    }
    public rename(id: string, title: string): void {
        // переименовываем title у категории
        this._categories[id].title = title;

        // переименовываем title в product.category = {id, title}
        this._categories[id].products.forEach(productId => {
            productDB.renameCategory(productId, title);
        });
    }

    public delete(id: string): void {
        // удаляем продукты категории
        this._categories[id].products.forEach(productId => productDB.delete(productId));

        // удаляем категорию из CategoryDB._categories
        delete this._categories[id];
    }

    public removeProductFromCategory(categoryId: string, productId: string): void {
        this._categories[categoryId].products = this._categories[categoryId].products.filter(prodId => prodId !== productId)
    }

    public findByTitle(title: string): ICategory | undefined {
        return this.getAll().find(category => category.title === title);
    }

}

export const categoryDB = new CategoryDB();
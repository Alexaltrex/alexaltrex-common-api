import {productMock} from "./productMock";
import {IAddReview, IProducts, IProductUpdate} from "../../interfaces/shop-interfaces";
import {articleCreate, getRate, id} from "../../helpers/helpers";
import {categoryDB} from "./CategoryDB";

class ProductDB {
    private _products: IProducts = productMock

    public getAll() {
        return [...Object.values(this._products)]
    }

    public getById(id: string) {
        return this._products[id]
    }

    public update(id: string, update: IProductUpdate) {
        this._products[id] = {...this._products[id], ...update};
    }

    public add(categoryId: string, product: IProductUpdate) {
        // добавляем товар в productDB
        const key = id();
        const article = articleCreate();
        const category = categoryDB.getById(categoryId);

        this._products[key] = {
            id: key,
            category: {
                id: category.id,
                title: category.title
            },
            article,
            rating: {
                "1": 0,
                "2": 0,
                "3": 0,
                "4": 0,
                "5": 0
            },
            rate: "0.00",
            reviews: [],
            ...product,
        };
        // добавляем ид товара в products для категории
        category.products.push(key);
    }

    public delete(id: string) {
        delete this._products[id];
    }

    public findByTitle(title: string) {
        return this.getAll().find(product => product.title === title)
    }

    public renameCategory(productId: string, title: string): void {
        this._products[productId].category.title = title;
    }

    public addReview({productId, rating, review, userName}: IAddReview): void {
            this._products[productId].rating[String(rating)] += 1;
            const newRate = getRate(this._products[productId].rating);
            this._products[productId].rate = newRate;
            this._products[productId].reviews.push({
                id: id(),
                rating,
                userName,
                review,
                date: new Date()
            })
    }

}

export const productDB = new ProductDB();



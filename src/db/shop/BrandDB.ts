import {brandMock} from "./brandMock";
import {IBrand} from "../../interfaces/shop-interfaces";

class BrandDB {
    private _brands: IBrand[] = brandMock;

    public getAll() {
        return [...this._brands]
    }

    public add(title: string) {
        this._brands.push(title);
    }
    public findByTitle(title: string): IBrand | undefined {
        return this._brands.find(el => el === title)
    }

}

export const brandDB = new BrandDB;
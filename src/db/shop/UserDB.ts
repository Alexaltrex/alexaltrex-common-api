import {IAddProductBasket, IUser, IUsers, RoleEnum} from "../../interfaces/shop-interfaces";
import {userMock} from "./userMock";
import {id} from "../../helpers/helpers";

interface IAddUser {
    login: string
    email: string
    password: string
}

class UserDB {
    private _users: IUsers = userMock

    public getAll(): IUser[] {
        return [...Object.values(this._users)]
    }

    public add(user: IAddUser): void { // user = {login, email, password}
        const key = id();
        this._users[key] = {
            ...user,
            id: key,
            role: RoleEnum.user, // при регистрации доступна только эта роль
            ratedProducts: {},
            basket: [],
            nickName: "",
        };
    }

    public findByKeyAndValue(key: string, value: any): IUser | undefined {
        const users = [...Object.values(this._users)];
        // @ts-ignore
        return users.find(user => user[key] === value)
    }

    public addRatedProduct(userId: string, productId: string, rating: number): void {
        this._users[userId].ratedProducts[productId] = rating;
    }

    public addProductToBasket(userId: string, productBasket: IAddProductBasket): void {
        const productCandidateIndex = this._users[userId].basket.findIndex(
            product => product.id === productBasket.id && product.selectedColor === productBasket.selectedColor
        )
        // если продукт с таким цветом и ид уже есть прибавляем количество с учетом макс. возможного

        if (productCandidateIndex !== -1) {
            const productCandidate = this._users[userId].basket[productCandidateIndex]
            const newQuantityInBasket = productCandidate.quantityInBasket + productBasket.quantityInBasket <= productCandidate.quantity
                ? productCandidate.quantityInBasket + productBasket.quantityInBasket
                : productCandidate.quantity;
            this._users[userId].basket[productCandidateIndex].quantityInBasket = newQuantityInBasket;
        } else { // иначе добавляем новый товар в массив
            this._users[userId].basket.push({
                ...productBasket,
                productInBasketId: id(),
            })
        }
    }

    public updateProductBasketCount(userId: string, productInBasketId: string, count: number): void {
        const productCandidateIndex = this._users[userId].basket.findIndex(
            product => product.productInBasketId === productInBasketId
        )
        if (productCandidateIndex !== -1 && count <= this._users[userId].basket[productCandidateIndex].quantity) {
            this._users[userId].basket[productCandidateIndex].quantityInBasket = count;
        }
    }

    public deleteProductFromBasket(userId: string, productInBasketId: string): void {
        const filteredProducts = this._users[userId].basket.filter(product => product.productInBasketId !== productInBasketId);
        this._users[userId].basket = filteredProducts;
    }

    public changePassword(userId: string, newPassword: string): void {
        this._users[userId].password = newPassword;
    }

    public changeNickname(userId: string, nickName: string) {
        this._users[userId].nickName = nickName;
    }

    public getNickname(userId: string): string {
        return this._users[userId].nickName;
    }
}

export const userDB = new UserDB();
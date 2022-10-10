import {JwtPayload} from "jsonwebtoken";

export interface IDecodedData extends JwtPayload {
    userId: string
    role: string
    login: string
}

//======== Brand ========//
export type IBrand = string

//======== User ========//
export type RoleType = "user" | "admin"

export enum RoleEnum {
    user = "user",
    admin = "admin"
}

export interface IProductBasket extends IProduct {
    productInBasketId: string
    selectedColor: string
    quantityInBasket: number
}

export type IAddProductBasket = Omit<IProductBasket, "productInBasketId">

export interface IUser {
    id: string
    login: string
    email: string
    password: string
    role: RoleType
    ratedProducts: { // {productId: rate}
        [key: string]: number
    },
    basket: IProductBasket[]
    nickName: string
}

export interface IUsers {
    [key: string]: IUser
}

//======== Category ========//
export interface ICategory {
    id: string
    title: string
    products: string[]
}

export interface ICategories {
    [key: string]: ICategory
}

//======== Product ========//
export interface IProduct {
    id: string
    title: string
    category: {
        id: string
        title: string
    }
    article: string
    available: boolean
    quantity: number
    description: string
    price: number
    weight: number
    colors: string[]
    brand: string
    rating: IRating
    rate: string
    reviews: IReview[]
}

export interface IReview {
    id: string
    rating: number
    userName: string
    review: string,
    date: Date
}

export interface IAddReview {
    productId: string
    rating: number
    review: string
    userName: string
}

export interface IRating {
    [key: string]: number
}

export interface IProducts {
    [key: string]: IProduct
}

export interface IProductUpdate {
    available: boolean
    brand: string
    colors: string[]
    description: string
    price: number
    quantity: number
    title: string
    weight: number
}

export interface IGetProductsQuery {
    sort: string
    query: string
    categoryId: string
    available: string
    brands: string
    page: string
    colors: string
    priceMin: string
    priceMax: string
}


export interface IProducts {
    [key: string]: IProduct
}

export interface IProduct {
    id: string
    name: string
    size: number
    weight: number
    description: string
}

export type ProductCreateType = Omit<IProduct, "id">
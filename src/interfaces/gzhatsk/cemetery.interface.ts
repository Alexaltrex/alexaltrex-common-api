export interface ICemeteries {
    [key: string]: ICemetery
}

export interface ICemetery {
    id: string
    name: string
    img: string
    description: {
        text: string
        source: string
    }[]
    stones: IGravestone[]
}

export type ICemeteryItem = Pick<ICemetery, "id" | "name" | "img">

export interface IGravestone {
    id: string
    name: string
    born: null | number | Date
    die: null | number | Date
    age: null | number
    description: string
    img: string
}
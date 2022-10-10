export interface IBook {
    id: string
    author: string
    title: string
    description: string
    year: number
    ISBN: string
    pageCount: number | null
    circulation: number | null // тираж
    publishingHouse: string // издательство
    publishingCity: string // город
    imgs: string[]
}

export interface IBooks {
    [key: string]: IBook
}





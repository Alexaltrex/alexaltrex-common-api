//======= Bricks Location ==========//
import {IUser} from "../shop-interfaces";

export interface ILocation {
    id: string
    name: string
    markIds: string[]
    slug: string
}

export interface ILocationFull {
    id: string
    name: string
    marks: IMarkFull[]
    slug: string
}

export interface ILocationListItem {
    id: string
    name: string
    slug: string
}

export interface ILocations {
    [key: string]: ILocation
}

//======= Bricks Mark ==========//
export interface IMarks {
    [key: string]: IMark
}

export interface IMark {
    id: string
    name: string
    slug: string
    description: string
    brickIds: string[],
    locationId: string
}

export interface IMarkFull {
    id: string
    name: string
    slug: string
    description: string
    bricks: IBrick[],
    locationId: string
}

export interface IMarkItem {
    id: string
    name: string
    slug: string
}

//======= Brick ==========//
export interface IBricks {
    [key: string]: IBrick
}

export interface IBrick {
    id: string
    value: string
    mark: {
        id: string
        name: string
    },
    fontKind: boolean
    border: boolean
    defectDescription: string | null;
    image: {
        small: string
        full: string
    }
}



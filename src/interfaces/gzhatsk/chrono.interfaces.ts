export interface IUpdateChronoItemDB {
    date: string
    text: string
    fullText: string
    src?: string
}

export interface IChronoItem {
    id: string
    date: string
    text: string
    fullText: string
    src: string
    createdByUserId: string
}

export type ChronoItemUpdateOnlyTextType = Omit<IChronoItem, "id" | "src" | "createdByUserId">

export type ChronoItemUpdateDBType = ChronoItemUpdateOnlyTextType & {
    src?: string
}
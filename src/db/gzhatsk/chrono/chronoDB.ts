import {chronoMock} from "./chronoMock";
import {ChronoItemUpdateDBType, IChronoItem} from "../../../interfaces/gzhatsk/chrono.interfaces";

export interface IChronoItems {
    [key: string]: IChronoItem
}

class ChronoDB {
    private _items: IChronoItems = chronoMock

    public getById(id: string): IChronoItem {
        return this._items[id];
    }

    public getAll(): IChronoItem[] {
        return Object.values(this._items)
    }

    public update(id: string, update: ChronoItemUpdateDBType): IChronoItem {
        this._items[id] = {...this._items[id], ...update}
        return this._items[id]
    }

    public add(updateItem: IChronoItem): IChronoItem {
        this._items[updateItem.id] = updateItem;
        return this._items[updateItem.id]
    }

    public delete(id: string): void {
        delete this._items[id]
    }
}

export const chronoDB = new ChronoDB();
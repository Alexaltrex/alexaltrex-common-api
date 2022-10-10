import {ICemeteries, ICemetery, ICemeteryItem, IGravestone} from "../../../interfaces/gzhatsk/cemetery.interface";
import {cemeteryMock} from "./cemeteryMock";

class CemeteryDB {
    private _cemeteries: ICemeteries = cemeteryMock

    public getAll(): ICemeteryItem[] {
        return Object.values((this._cemeteries)).map(({id, name, img}) => ({
            id,
            name,
            img
        }))
    }

    public getById(id: string): ICemetery {
        const cem = this._cemeteries[id]
        const stones = [...cem.stones].sort((a: IGravestone, b: IGravestone) => {
            if (a.name > b.name) {
                return 1
            }
            if (a.name < b.name) {
                return -1
            }
            return 0
        })

        return {...cem, stones}
    }
}
export const cemeteryDB = new CemeteryDB();
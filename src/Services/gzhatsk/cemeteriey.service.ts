import {cemeteryDB} from "../../db/gzhatsk/cemetery/CemeteryDB";

export const cemeteryService = {
    getAll: () => cemeteryDB.getAll(),
    getById: (id: string) => cemeteryDB.getById(id)
}
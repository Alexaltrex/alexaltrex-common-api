import {markDB} from "../../db/gzhatsk/bricks/MarkDB";
import {IMarkFull, IMarkItem} from "../../interfaces/gzhatsk/bricks.interfaces";

export const markService = {
    //========== GET All MARKS =========//
    getAll: (): IMarkItem[] => {
        const marks = markDB.getAll();
        const marksSorted = marks.sort((a: IMarkItem, b: IMarkItem) => {
            if (a.name > b.name) {
                return 1
            }
            if (a.name < b.name) {
                return -1
            }
            return 0;
        });
        return marksSorted;
    },

    //========== GET BY ID =========//
    getById: (id: string): IMarkFull => {
        const mark = markDB.getMarkById(id);
        return mark;
    }
}

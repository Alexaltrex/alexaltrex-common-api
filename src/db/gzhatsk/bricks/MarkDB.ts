import {IMark, IMarkFull, IMarkItem, IMarks} from "../../../interfaces/gzhatsk/bricks.interfaces";
import {markMock} from "./markMock";
import {brickDB} from "./BrickDB";

class MarkDB {
    private _bricksMarks: IMarks = markMock

    public getAll(): IMarkItem[] {
        return [
            ...(Object.values(this._bricksMarks)
                .map(({id, name, slug}) => ({id, name, slug})))
        ]
    }

    public getMarkById(id: string): IMarkFull {
        const mark = this._bricksMarks[id];
        const {brickIds, ...restMark} = mark;
        const bricks = brickIds.map(brickId => brickDB.getBrickById(brickId));
        return {...restMark, bricks}
    }

}

export const markDB = new MarkDB();
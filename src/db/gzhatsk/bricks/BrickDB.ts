import {IBrick, IBricks} from "../../../interfaces/gzhatsk/bricks.interfaces";
import {brickMock} from "./brickMock";

class BrickDB {
    private _bricks: IBricks = brickMock

    public getBrickById(id: string): IBrick {
        return this._bricks[id]
    }

    public getBricks(): IBrick[] {
        return Object.values(this._bricks);
    }

}

export const brickDB = new BrickDB();
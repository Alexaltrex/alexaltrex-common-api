import {
    ILocationFull,
    ILocationListItem,
    ILocations
} from "../../../interfaces/gzhatsk/bricks.interfaces";
import {locationMock} from "./locationMock";
import {markDB} from "./MarkDB";

class LocationDB {
    private _bricksLocations: ILocations = locationMock

    public getLocationsList(): ILocationListItem[] {
        return [
            ...(Object.values(this._bricksLocations)
                .map(({id, name, slug}) => ({id, name, slug})))
        ]
    }

    public getLocationById(id: string): ILocationFull {
        const location = this._bricksLocations[id];
        const {markIds, ...locationRest} = location;
        const marks = markIds.map(markId => markDB.getMarkById(markId));
        const locationPopulated = {...locationRest, marks};
        return locationPopulated
    }

}

export const locationDB = new LocationDB();
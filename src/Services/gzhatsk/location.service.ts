import {locationDB} from "../../db/gzhatsk/bricks/LocationDB";
import {ILocationFull, ILocationListItem} from "../../interfaces/gzhatsk/bricks.interfaces";

export const locationService = {
    //========== GET LOCATIONS =========
    getLocationsList: (): ILocationListItem[] => {
        const locationListItems = locationDB.getLocationsList();
        return locationListItems;
    },

    //========== GET LOCATION BY ID =========
    getLocationById: (id: string): ILocationFull => {
        const location = locationDB.getLocationById(id);
        return location;
    },
}
import {NextFunction, Request, Response} from "express";
import {locationService} from "../../../Services/gzhatsk/location.service";

export const locationController = {
    //========== GET LOCATIONS =========
    getLocationsList: (req: Request, res: Response, next: NextFunction) => {
        try {
            const locationListItems = locationService.getLocationsList();

            res.json({
                status: 'ok',
                data: locationListItems,
                message: ''
            });
        } catch (e) {
            next(e)
        }
    },
    //========== GET LOCATION BY ID =========
    getLocationById: (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const location = locationService.getLocationById(id);

            res.json({
                status: 'ok',
                data: location,
                message: ''
            });
        } catch (e) {
            next(e)
        }
    },
};
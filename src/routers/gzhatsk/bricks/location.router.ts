import express from 'express';
import {locationController} from "../../../controllers/gzhatsk/bricks/location.controller";

export const locationRouter = express.Router();
//========== GET LOCATIONS =========
locationRouter.get('/', locationController.getLocationsList);
//========== GET LOCATION BY ID =========
locationRouter.get('/:id', locationController.getLocationById);



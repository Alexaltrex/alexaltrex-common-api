import {Router} from "express";
import {locationRouter} from "./bricks/location.router";
import {markRouter} from "./bricks/mark.router";
import {brickRouter} from "./bricks/brick.router";
import {gzhatskAuthRouter} from "./auth.router";
import {chronoRouter} from "./chrono.router";
import {bookRouter} from "./book.router";
import {cemeteryRouter} from "./cemetery.router";

export const gzhatskRootRouter = Router();
gzhatskRootRouter.use('/bricks/location', locationRouter);
gzhatskRootRouter.use('/bricks/mark', markRouter);
gzhatskRootRouter.use('/bricks/brick', brickRouter);
gzhatskRootRouter.use('/auth', gzhatskAuthRouter);
gzhatskRootRouter.use('/chrono', chronoRouter);
gzhatskRootRouter.use('/book', bookRouter);
gzhatskRootRouter.use('/cemetery', cemeteryRouter);
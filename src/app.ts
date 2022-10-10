import dotenv from 'dotenv';

dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {errorHandler} from "./middlewares/errorHandler";
import {gzhatskRootRouter} from "./routers/gzhatsk/gzhatskRootRouter";
import {rtkQueryRootRouter} from "./routers/rtk-query/rtkQueryRoot.router";
import {shopRootRouter} from "./routers/shop/shopRootRouter";
import {authSessionRootRouter} from "./routers/auth-sessions/rootRouter";

const app = express();
const PORT = process.env.PORT || 80;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use(cors({
    credentials: true,
    origin: process.env.NODE_ENV === "production"
        ? "https://alexaltrex.github.io"
        : "http://localhost:3000"
}));

app.use('/shop', shopRootRouter);
app.use('/gzhatsk', gzhatskRootRouter);
app.use('/rtkquery', rtkQueryRootRouter);
app.use('/authsessions', authSessionRootRouter);
app.use(errorHandler);

const start = async () => {
    try {
        app.listen(PORT, () => console.log(`Server start on PORT = ${PORT}`));
        //console.log(process.env.NODE_ENV);
    } catch (e) {
        console.error('Server error', e);
        process.exit(1);
    }
};
start();

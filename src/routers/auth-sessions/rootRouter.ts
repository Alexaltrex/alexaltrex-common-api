import {NextFunction, Request, Response, Router} from "express";
import {authRouter} from "./authRouter";
import session from 'express-session';
import connectRedis from 'connect-redis';
import {createClient} from "redis";
import {LoginType} from "../../interfaces/auth-sessions.types";

export const authSessionRootRouter = Router();

let redisClient = createClient({legacyMode: true});
redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});

redisClient.connect().catch(console.error);
const RedisStore = connectRedis(session);

authSessionRootRouter.use(session({
    store: new RedisStore({client: redisClient}),
    saveUninitialized: false,
    secret: "keyboard cat",
    resave: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: undefined
    }
}))

authSessionRootRouter.use("/auth", authRouter);
authSessionRootRouter.get(
    "/test",
    (req: Request<any, any, LoginType>, res: Response, next: NextFunction) => {
        res.json("test-response")
    }
)


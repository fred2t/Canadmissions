import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import usersRouter from "../api/routes/users";
import { DEFAULT_CORS_SETTINGS } from "../.app/serverSettings";
import startupRouter from "../api/routes/startup";
import communitiesRouter from "../api/routes/communities";
import postsRouter from "../api/routes/posts";
import commentsRouter from "../api/routes/comments";
import { API } from "../utils/namespaces";

export function initializedApplication(): Express {
    const application = express();

    application.use(cors(DEFAULT_CORS_SETTINGS), cookieParser(), express.json({}));

    application.use(API.Space.Startup, startupRouter);
    application.use(API.Space.Users, usersRouter);
    application.use(API.Space.Communities, communitiesRouter);
    application.use(API.Space.Posts, postsRouter);
    application.use(API.Space.Comments, commentsRouter);

    return application;
}

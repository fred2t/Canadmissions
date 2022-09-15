import { NextFunction, Request, Response } from "express";

import { removeSpaces, simpleUUID } from "../../utils/methods/generalHelpers";
import { Cadmiss } from "../../utils/namespaces";

export function removeSpacesFromUsername(req: Request, res: Response, next: NextFunction) {
    /**
     * Usernames can't have spaces so this will prevent the case of the client
     * editing source code to be able to have a space in their username.
     */

    req.body.username = removeSpaces(req.body.username);
    next();
}

export function appendUsername(req: Request, res: Response, next: NextFunction) {
    /**
     * Adjust user's username to avoid duplicates since it will be replaced soon after.
     */

    req.body.username += simpleUUID(5);
    next();
}

export function capUsernameLength(
    req: Request<unknown, unknown, { username: string }>,
    res: Response<void>,
    next: NextFunction
) {
    /**
     * Cap the length of the username.
     */

    req.body.username = req.body.username.slice(0, Cadmiss.MAX_USERNAME_LENGTH);
    next();
}

export async function validateParamsUserId(
    req: Request<{ userId: string }>,
    res: Response<{ invalidParamsUserId: true }>,
    next: NextFunction
) {
    const { userId } = req.params;

    if (isNaN(+userId)) return res.status(400).json({ invalidParamsUserId: true });

    next();
}

import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { ENVS } from "../../.app/serverEnvVars";
import { CookieKeys } from "../../utils/enums";
import { parseCookieString } from "../../utils/methods/generalHelpers";

import { API, Protection, ThirdParty } from "../../utils/namespaces";
import { appConsoleLog } from "../../zControl/serverDebugging";

export function moveNextJSCookiesToReq(req: Request, res: Response<void>, next: NextFunction) {
    /**
     * NextJS SSR doesn't send cookies through request automatically. It will be manually
     * sent through headers. This moves it to be compatible with the other api methods.
     */

    const { [API.HeaderKeys.SSRCookieString]: cookieString } = req.headers as {
        [API.HeaderKeys.SSRCookieString]: string;
    };

    appConsoleLog("moving head", typeof cookieString);
    const parsedCookies = parseCookieString(cookieString);
    // appConsoleLog(parsedCookies);

    req.cookies = parsedCookies;
    next();
}

export async function validateHuman(
    req: Request<unknown, unknown, API.MiddlewareAddons[API.Middlewares.ValidateHuman]>,
    res: Response<{ clientIsRobot: true }>,
    next: NextFunction
) {
    const { reCAPTCHAToken } = req.body;
    appConsoleLog(reCAPTCHAToken);

    const response = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${ENVS.RECAPTCHA_SECRET_KEY}&response=${reCAPTCHAToken}`,
        { method: "POST" }
    );
    const data: ThirdParty.ReCAPTCHAVerification = await response.json();
    appConsoleLog("recap", data);

    if (data.success) {
        next();
    } else {
        res.status(400).json({ clientIsRobot: true });
    }
}

export function validateToken(
    req: Request & API.MiddlewareAddons[API.Middlewares.ValidateToken],
    res: Response<{ noAccessToken: true } | { badAccessToken: true }>,
    next: NextFunction
) {
    /**
     * Check if user exists and the information in the jwt token has not changed
     */

    const { [CookieKeys.AccessToken]: accessToken } = req.cookies;
    if (!accessToken) return res.json({ noAccessToken: true });

    // The try block will try to verify the token and if it fails, an error will be thrown
    try {
        const decodedToken = verify(accessToken, ENVS.JWT_SECRET_KEY) as Protection.JWTDetails;
        appConsoleLog("decodedToken", decodedToken);

        req.client = {
            clientId: decodedToken.clientId,
            clientUsername: decodedToken.clientUsername,
        };
        next();
    } catch (err) {
        appConsoleLog(err);
        return res.json({ badAccessToken: true });
    }
}

export function validateTokenAlwaysContinue(
    req: Request & API.MiddlewareAddons[API.Middlewares.ValidateTokenAlwaysContinue],
    res: Response<void>,
    next: NextFunction
) {
    /**
     * Same as @var validateToken but won't send a response on failure.
     *
     * Needed if guests can view a feature but people with accounts have a customized
     * UI.
     */

    const { [CookieKeys.AccessToken]: accessToken } = req.cookies;
    appConsoleLog("valid alw cont");

    try {
        const decodedToken = verify(accessToken, ENVS.JWT_SECRET_KEY) as Protection.JWTDetails;
        appConsoleLog("decodedToken alw cont", decodedToken);

        req.client = {
            clientId: decodedToken.clientId,
            clientUsername: decodedToken.clientUsername,
        };
    } catch (err) {
        appConsoleLog("token fail");

        req.client = {};
    } finally {
        next();
    }
}

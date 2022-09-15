import forge from "node-forge";
import { sign } from "jsonwebtoken";

import { DB } from ".";
import { ENVS } from "../../.app/serverEnvVars";
import { CookieKeys } from "../enums";
import { Response } from "express";

export interface JWTDetails {
    clientId: number;
    clientUsername: string;
}

export function createJWT(client: { clientId: number; clientUsername: string }) {
    const accessToken = sign(client, ENVS.JWT_SECRET_KEY, {
        noTimestamp: true,
    });

    return accessToken;
}

export function deliverAccessToken(
    res: Response,
    client: { clientId: number; clientUsername: string }
) {
    const accessToken = createJWT(client);

    res.status(200).cookie(CookieKeys.AccessToken, accessToken, {
        maxAge: 60 * 60 * 24 * 30 * 1000,
        httpOnly: true,
    });
}

export function hashString(msg: string, encoding?: forge.Encoding | undefined): string {
    /**
     * sha256
     */

    const hashSource = forge.md.sha256.create();
    hashSource.update(msg, encoding);
    return hashSource.digest().toHex();
}

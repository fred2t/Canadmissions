import { Request, Response } from "express";
import { API } from "../../utils/namespaces";

export async function confirmLoginCredentials(
    req: Request & API.MiddlewareAddons[API.Middlewares.ValidateToken],
    res: Response<{ loggedIn: true; clientId: number; clientUsername: string }>
) {
    /**
     * Log the client in when they enter the page if they are already logged in.
     */

    const { clientId, clientUsername } = req.client!;
    
    if (clientId && clientUsername)
        res.status(200).json({ loggedIn: true, clientId, clientUsername });

    // don't need to send back a fail message since the token validation middleware
    // will do that if necessary
}

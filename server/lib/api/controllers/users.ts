import { Request, Response } from "express";

import { CookieKeys } from "../../utils/enums";
import { shuffle } from "../../utils/methods/arrayHelpers";
import { removeSpaces } from "../../utils/methods/generalHelpers";
import { API, Cadmiss, DB, Protection } from "../../utils/namespaces";
import { appConsoleLog } from "../../zControl/serverDebugging";
import { selectAllUserJoinedCommunities } from "../services/joinedCommunitiesTable";
import {
    selectCadmissPostsByUserFollowedCommunities,
    selectTrendingPosts,
} from "../services/postsTable";
import {
    deleteUserById,
    selectUserByEmail,
    selectUserByUsername,
    insertNewUser,
    updatePasswordWithUsername,
    updateUsernameWithId,
} from "../services/usersTable";

export async function signUpUser(
    req: Request<unknown, unknown, { username: string; email: string; password: string }> &
        API.MiddlewareAddons[API.Middlewares.ValidateHuman],
    res: Response<
        | { duplicatedColumn: "username" | "email" }
        | { userCreated: true; clientId: number; clientUsername: string }
    >
) {
    const { username, email, password } = req.body;
    appConsoleLog("bod", req.body);

    const hashedPassword = Protection.hashString(password);
    appConsoleLog(hashedPassword);

    try {
        const [result] = await insertNewUser({
            username: username,
            email,
            password: hashedPassword,
        });
        appConsoleLog("result", result);

        // access token for authentication
        Protection.deliverAccessToken(res, { clientId: result.insertId, clientUsername: username });
        res.status(200).json({
            userCreated: true,
            clientId: result.insertId,
            clientUsername: username,
        });
    } catch (err) {
        const dbError = err as DB.MySQLErrorObject;

        switch (dbError.code as DB.MySQLErrorCodes) {
            case DB.MySQLErrorCodes.ER_DUP_ENTRY:
                res.status(400).json({
                    duplicatedColumn: DB.getDuplicatedColumn(dbError, "users"),
                });
        }

        appConsoleLog("no register");
    }
}

export async function logInUser(
    req: Request<unknown, unknown, { username: string; password: string }>,
    res: Response<
        | { userNotFound: true }
        | { wrongPassword: true }
        | { loggedIn: true; clientId: number; clientUsername: string }
    >
) {
    const { password, username } = req.body;

    const dbUser = await selectUserByUsername(username);
    if (dbUser == undefined) return res.status(400).json({ userNotFound: true });

    appConsoleLog(dbUser);

    const hashedPassword = Protection.hashString(password);
    if (hashedPassword === dbUser.password) {
        // log in user
        Protection.deliverAccessToken(res, {
            clientId: dbUser.id,
            clientUsername: dbUser.username,
        });
        res.status(200).json({
            loggedIn: true,
            clientId: dbUser.id,
            clientUsername: dbUser.username,
        });
    } else {
        // notify user that password is wrong
        res.status(400).json({ wrongPassword: true });
    }
}

export async function googleSignOn(
    req: Request<unknown, unknown, { username: string; email: string; googleAccountId: string }>,
    res: Response<
        | { loggedIn: true; clientId: number; clientUsername: string }
        | { accountCreated: true; clientId: number; temporaryUsername: string }
    >
) {
    /**
     * If the user isn't signed up, insert them then ask if they want to change
     * their username from the default one. Otherwise, just log them in.
     */

    const { email, username, googleAccountId } = req.body;

    // the user's id is needed to log them in
    const dbUser = await selectUserByEmail(email);

    if (dbUser != undefined) {
        // log them in
        Protection.deliverAccessToken(res, {
            clientId: dbUser.id,
            clientUsername: dbUser.username,
        });

        res.status(200).json({
            loggedIn: true,
            clientId: dbUser.id,
            clientUsername: dbUser.username,
        });
    } else {
        // log them in
        const hashedAccId = Protection.hashString(googleAccountId);
        const [reslt] = await insertNewUser({ username, email, password: hashedAccId });
        Protection.deliverAccessToken(res, { clientId: reslt.insertId, clientUsername: username });

        // send back the temporary username so they can see if they'd like to change it
        res.status(200).json({
            accountCreated: true,
            clientId: reslt.insertId,
            temporaryUsername: username,
        });
    }
}

export async function changeUsername(
    req: Request<unknown, unknown, { newUsername: string }> &
        API.MiddlewareAddons[API.Middlewares.ValidateToken],
    res: Response<{ usernameChanged: true; newUsername: string } | { usernameTaken: true }>
) {
    /**
     * A followup to @var googleSignOn, this endpoint is called when the user
     * decides to change their username after their account is made.
     */

    req.body.newUsername = req.body.newUsername.slice(0, Cadmiss.MAX_USERNAME_LENGTH);
    req.body.newUsername = removeSpaces(req.body.newUsername);
    const { clientId } = req.client!;
    const { newUsername } = req.body;

    try {
        // try updating user's username
        await updateUsernameWithId(clientId, newUsername);

        // log them in
        Protection.deliverAccessToken(res, { clientId, clientUsername: newUsername });
        res.status(200).json({ usernameChanged: true, newUsername });
    } catch (err) {
        // if the username is already taken, notify user
        res.status(400).json({ usernameTaken: true });
    }
}

export function logOutUser(
    req: Request<unknown, unknown, void>,
    res: Response<{ loggedOut: true }>
) {
    res.status(200).clearCookie(CookieKeys.AccessToken);
    res.status(200).json({ loggedOut: true });
}

export async function changePassword(
    req: Request<unknown, unknown, { username: string; oldPassword: string; newPassword: string }>,
    res: Response<
        | { noAccountWithUsername: true }
        | { wrongPassword: true }
        | { oldPasswordSameAsNew: true }
        | { passwordChanged: true }
    >
) {
    /**
     * This endpoint is called when the user wants to change their password.
     */

    appConsoleLog("got req", req.body);
    const { newPassword, oldPassword, username } = req.body;

    const hashedOldPassword = Protection.hashString(oldPassword);
    const user = await selectUserByUsername(username);

    if (!user) res.status(400).json({ noAccountWithUsername: true });
    else if (user.password !== hashedOldPassword) res.status(400).json({ wrongPassword: true });
    else {
        const hashedNewPassword = Protection.hashString(newPassword);

        if (user.password === hashedNewPassword)
            return res.status(400).json({ oldPasswordSameAsNew: true });

        try {
            await updatePasswordWithUsername(username, hashedNewPassword);
            res.status(200).json({ passwordChanged: true });
        } catch (err) {
            appConsoleLog("wtf?");
        }
    }
}

export async function deleteAccount(
    req: Request<unknown, unknown, void> & API.MiddlewareAddons[API.Middlewares.ValidateToken],
    res: Response<{ accountDeleted: true }>
) {
    const { clientId } = req.client!;

    // no need to try catch since delete won't error if the column doesn't exist
    await deleteUserById(clientId);

    res.status(200).clearCookie(CookieKeys.AccessToken);
    res.status(200).json({ accountDeleted: true });
}

export async function getHomepage(
    req: Request<{ userId: string }> &
        API.MiddlewareAddons[API.Middlewares.ValidateTokenAlwaysContinue],
    res: Response<{ posts: Cadmiss.Post[] }>
) {
    const { clientId } = req.client!;

    appConsoleLog("ccc", clientId);
    let posts: Cadmiss.Post[] = [];

    if (clientId == null) {
        posts = await selectTrendingPosts({ userId: clientId ?? null });
    } else {
        const clientJoinedCommunities = await selectAllUserJoinedCommunities(clientId);

        if (clientJoinedCommunities == null) {
            posts = await selectTrendingPosts({ userId: clientId ?? null });
        } else {
            posts = await selectCadmissPostsByUserFollowedCommunities({
                userId: clientId,
                userFollowedCommunities: clientJoinedCommunities,
            });
        }
    }

    // shuffle(posts);
    res.status(200).json({ posts });
}

//
//
//

export function getProfile(
    req: Request & API.MiddlewareAddons[API.Middlewares.ValidateToken],
    res: Response
) {
    const { clientId, clientUsername } = req.client!;
    console.log("req", clientId, clientUsername);
    res.json({ m: "Profile", gg: clientUsername });
}

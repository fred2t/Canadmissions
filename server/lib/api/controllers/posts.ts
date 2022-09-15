import { Request, Response } from "express";
import { shuffle } from "../../utils/methods/arrayHelpers";
import { API, Cadmiss, Time } from "../../utils/namespaces";
import { appConsoleLog } from "../../zControl/serverDebugging";
import { selectInteractiveCommentsByPostId } from "../services/commentsTable";
import {
    insertNewPost,
    deleteDbCadmissPost,
    toggleLikeDbCadmissPost,
    selectInteractivePostById,
} from "../services/postsTable";

export async function createPost(
    req: Request<
        unknown,
        unknown,
        {
            community: Cadmiss.SchoolAcronyms;
            title: string;
            bodyMetadata: string;
        }
    > &
        API.MiddlewareAddons[API.Middlewares.ValidateToken],
    res: Response<{ postMade: true } | { lackingInfo: true } | { invalidInfo: true }>
) {
    req.body.bodyMetadata = req.body.bodyMetadata.slice(0, Cadmiss.MAX_POST_CONTENT_LENGTH);

    const { bodyMetadata, title, community } = req.body;
    const { clientId } = req.client!;

    // make sure values are defined
    if ([title, community].some((postElement) => !postElement)) {
        return res.status(400).json({ lackingInfo: true });

        // check they are the defined length
    } else if (
        title.length > Cadmiss.MAX_POST_TITLE_LENGTH ||
        bodyMetadata.length > Cadmiss.MAX_POST_CONTENT_LENGTH
    ) {
        return res.status(400).json({ invalidInfo: true });
    }

    try {
        await insertNewPost({
            createdAt: Time.currentEpochTime(),
            authorId: clientId,
            community,
            title,
            bodyMetadata,
        });

        appConsoleLog("added");
        res.status(200).json({ postMade: true });
    } catch (e) {
        appConsoleLog(e);
    }
}

export async function getInteractivePostInfo(
    req: Request<{ postId: string }> &
        API.MiddlewareAddons[API.Middlewares.ValidateTokenAlwaysContinue],
    res: Response<
        | { invalidParamsPostId: true }
        | { postNotExist: true }
        | { post: Cadmiss.Post; comments: Cadmiss.Comment[] }
    >
) {
    const { postId } = req.params;
    const { clientId } = req.client!;

    const post = await selectInteractivePostById({ postId: +postId, userId: clientId ?? null });
    if (post == null) return res.send({ postNotExist: true });

    const comments = await selectInteractiveCommentsByPostId({
        postId: +postId,
        clientId: clientId ?? null,
    });
    shuffle(comments);

    res.status(200).json({ post, comments });
}

export async function toggleLikeCadmissPost(
    req: Request<{ postId: string }> & API.MiddlewareAddons[API.Middlewares.ValidateToken],
    res: Response<{ error: unknown } | { actionCompleted: true }>
) {
    const { postId } = req.params;
    const { clientId } = req.client!;

    try {
        const [reslt] = await toggleLikeDbCadmissPost({ postId: +postId, userId: clientId });
        appConsoleLog(reslt);

        res.status(200).json({ actionCompleted: true });
    } catch (e) {
        appConsoleLog(e);
        res.status(400).json({ error: e });
    }
}

export async function deleteCadmissPost(
    req: Request<{ postId: string }> & API.MiddlewareAddons[API.Middlewares.ValidateToken],
    res: Response<{ postDeleted: true }>
) {
    const { postId } = req.params;
    const { clientId } = req.client!;

    await deleteDbCadmissPost({ authorId: clientId, postId: +postId });

    res.status(200).json({ postDeleted: true });
}

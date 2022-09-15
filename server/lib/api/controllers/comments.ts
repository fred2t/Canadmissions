import { Request, Response } from "express";
import { API, DB } from "../../utils/namespaces";
import { appConsoleLog } from "../../zControl/serverDebugging";
import {
    deleteDbCadmissComment,
    insertChildComment,
    insertRootComment,
    toggleLikeDbCadmissComment,
} from "../services/commentsTable";

export async function createComment(
    req: Request<
        { postId: string },
        unknown,
        { parentCommentId: number | null; bodyMetadata: string }
    > &
        API.MiddlewareAddons[API.Middlewares.ValidateToken],
    res: Response<
        | { invalidParamsPostId: true }
        | { emptyBody: true }
        | {
              commented: true;
              commentMetadata: {
                  commentId: number;
                  createdAt: number;
              };
          }
    >
) {
    const { clientId } = req.client!;
    const { postId } = req.params;
    const { parentCommentId, bodyMetadata } = req.body;

    appConsoleLog("reqqing", clientId, postId, parentCommentId, bodyMetadata);

    if (isNaN(+postId)) return res.status(400).json({ invalidParamsPostId: true });
    if (bodyMetadata.length < 1) return res.status(400).json({ emptyBody: true });

    const mutualCommentArguments = {
        postId: +postId,
        authorId: clientId,
        createdAt: Date.now(),
        bodyMetadata,
        parentCommentId,
    };

    // separating arguments and not using ternaries to make it easier for ts
    // to infer types
    try {
        let insertHeader: DB.InsertResultSetHeader | undefined;

        if (parentCommentId === null) {
            [insertHeader] = await insertRootComment({
                ...mutualCommentArguments,
                parentCommentId,
            });
        } else if (typeof parentCommentId === "number") {
            [insertHeader] = await insertChildComment({
                ...mutualCommentArguments,
                parentCommentId,
            });
        }
        appConsoleLog("added comm");

        res.status(200).json({
            commented: true,
            commentMetadata: { commentId: insertHeader!.insertId, createdAt: Date.now() },
        });
    } catch (e) {
        appConsoleLog("wrong", e);
    }
}

export async function deleteCadmissComment(
    req: Request<{ commentId: string }> & API.MiddlewareAddons[API.Middlewares.ValidateToken],
    res: Response<{ commentDeleted: true }>
) {
    const { commentId } = req.params;
    const { clientId } = req.client!;

    await deleteDbCadmissComment({
        authorId: clientId,
        commentId: +commentId,
    });
    appConsoleLog("deleted comment");

    res.status(200).json({ commentDeleted: true });
}

export async function toggleLikeCadmissComment(
    req: Request<{ commentId: string }> & API.MiddlewareAddons[API.Middlewares.ValidateToken],
    res: Response<{ actionCompleted: true } | { error: unknown }>
) {
    const { commentId } = req.params;
    const { clientId } = req.client!;

    try {
        await toggleLikeDbCadmissComment({ commentId: +commentId, userId: clientId });
        appConsoleLog("toggled");

        res.status(200).json({ actionCompleted: true });
    } catch (e) {
        appConsoleLog(e);
        res.status(400).json({ error: e });
    }

    // res.status(200).json({})
}

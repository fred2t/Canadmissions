import { NextFunction, Request, Response } from "express";

export function validateCommentId(
    req: Request<{ commentId: string }>,
    res: Response<{ invalidParamsCommentId: true }>,
    next: NextFunction
) {
    const { commentId } = req.params;

    if (isNaN(+commentId)) {
        return res.status(400).json({ invalidParamsCommentId: true });
    }

    next();
}

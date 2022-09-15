import { NextFunction, Request, Response } from "express";

export function validatePostId(
    req: Request<{ postId: string }>,
    res: Response<{ invalidParamsPostId: true }>,
    next: NextFunction
) {
    const { postId } = req.params;

    if (isNaN(+postId)) {
        return res.status(400).json({ invalidParamsPostId: true });
    }

    next();
}

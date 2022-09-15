import { NextFunction, Request, Response } from "express";
import { Cadmiss } from "../../utils/namespaces";

export function validateBodyCommunityExist(
    req: Request<unknown, unknown, { community: Cadmiss.SchoolAcronyms }>,
    res: Response<{ communityNotExist: true }>,
    next: NextFunction
) {
    const { community } = req.body;
    const validCommunities = Object.values(Cadmiss.SchoolAcronyms);

    if (validCommunities.includes(community)) {
        next();
    } else {
        return res.status(400).json({ communityNotExist: true });
    }
}

export function validateParamsCommunityExist(
    req: Request<{ community: Cadmiss.SchoolAcronyms }>,
    res: Response<{ communityNotExist: true }>,
    next: NextFunction
) {
    const { community } = req.params;
    const validCommunities = Object.values(Cadmiss.SchoolAcronyms);

    if (validCommunities.includes(community)) {
        next();
    } else {
        return res.status(400).json({ communityNotExist: true });
    }
}

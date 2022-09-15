import { Request, Response } from "express";
import { shuffle } from "../../utils/methods/arrayHelpers";
import { API, Cadmiss } from "../../utils/namespaces";
import { appConsoleLog } from "../../zControl/serverDebugging";
import { selectCommunityCadmissPosts } from "../services/communitiesTable";
import {
    deleteCommunityMember,
    selectIsCommunityMember,
    insertCommunityMember,
} from "../services/joinedCommunitiesTable";

export async function toggleJoinCommunity(
    req: Request<unknown, unknown, { community: Cadmiss.SchoolAcronyms }> &
        API.MiddlewareAddons[API.Middlewares.ValidateToken],
    res: Response<{ joinedCommunity: true } | { leftCommunity: true }>
) {
    const { clientId } = req.client!;
    const { community } = req.body;

    const communityJoined = await selectIsCommunityMember(clientId, community);
    appConsoleLog("isjoined", communityJoined);

    // delete or join community if user is in or not in community respectively
    await (communityJoined ? deleteCommunityMember : insertCommunityMember)(clientId, community);

    // send response depending on same logic as line above
    res.status(200).json(communityJoined ? { leftCommunity: true } : { joinedCommunity: true });
}

export async function getInteractiveCommunityInfo(
    req: Request<{ community: Cadmiss.SchoolAcronyms }> &
        API.MiddlewareAddons[API.Middlewares.ValidateTokenAlwaysContinue],
    res: Response<{ isCommunityMember: boolean; communityPosts: Cadmiss.Post[] }>
) {
    const { clientId } = req.client!;
    const { community } = req.params;

    const isCommunityMember: boolean = clientId
        ? await selectIsCommunityMember(clientId, community)
        : false;
    const communityPosts = await selectCommunityCadmissPosts({
        community,
        userId: clientId ?? null,
    });
    appConsoleLog(communityPosts.length)
    // shuffle(communityPosts);

    res.status(200).json({ isCommunityMember, communityPosts });
}

import express from "express";
import { API } from "../../utils/namespaces";
import { getInteractiveCommunityInfo, toggleJoinCommunity } from "../controllers/communities";
import {
    validateBodyCommunityExist,
    validateParamsCommunityExist,
} from "../middlewares/communitiesMiddlewares";
import {
    moveNextJSCookiesToReq,
    validateToken,
    validateTokenAlwaysContinue,
} from "../middlewares/generalMiddlewares";

const router = express.Router();

router
    .route(API.Routes.ToggleJoinCommunity)
    .post(validateBodyCommunityExist, validateToken, toggleJoinCommunity);
router
    .route("/:community")
    .get(
        validateParamsCommunityExist,
        moveNextJSCookiesToReq,
        validateTokenAlwaysContinue,
        getInteractiveCommunityInfo
    );

export default router;

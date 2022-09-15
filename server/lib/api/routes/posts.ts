import express from "express";
import { API } from "../../utils/namespaces";
import {
    createPost,
    deleteCadmissPost,
    getInteractivePostInfo,
    toggleLikeCadmissPost,
} from "../controllers/posts";
import { validateBodyCommunityExist } from "../middlewares/communitiesMiddlewares";
import {
    moveNextJSCookiesToReq,
    validateToken,
    validateTokenAlwaysContinue,
} from "../middlewares/generalMiddlewares";
import { validatePostId } from "../middlewares/postsMiddlewares";

const router = express.Router();

router.route(API.Routes.CreatePost).post(validateBodyCommunityExist, validateToken, createPost);
router
    .route("/:postId")
    .get(
        validatePostId,
        moveNextJSCookiesToReq,
        validateTokenAlwaysContinue,
        getInteractivePostInfo
    )
    .delete(validatePostId, validateToken, deleteCadmissPost);
router.route("/like-post/:postId").post(validatePostId, validateToken, toggleLikeCadmissPost);

export default router;

import express from "express";
import {
    createComment,
    deleteCadmissComment,
    toggleLikeCadmissComment,
} from "../controllers/comments";
import { validateCommentId } from "../middlewares/commentsMiddlewares";
import { validateToken } from "../middlewares/generalMiddlewares";

const router = express.Router();

router.route("/:postId").post(validateToken, createComment);
router.route("/:commentId").delete(validateCommentId, validateToken, deleteCadmissComment);
router
    .route("/like-comment/:commentId")
    .post(validateCommentId, validateToken, toggleLikeCadmissComment);

export default router;

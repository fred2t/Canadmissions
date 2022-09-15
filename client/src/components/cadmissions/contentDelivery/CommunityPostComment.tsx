// import DOMPurify from "isomorphic-dompurify";
import IconButton from "@mui/material/IconButton";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Button from "@mui/material/Button";
import ReplyIcon from "@mui/icons-material/Reply";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useRef, useState } from "react";

import { API, Cadmiss, Time } from "../../../utils/namespaces";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { startSigningUp } from "../../../redux/slices/clientSlice";
import { appConsoleLog } from "../../../clientDebugging";

import CommunityPostCommentList from "./CommunityPostCommentList";
import CommunityParticipationEditor from "./CommunityParticipationEditor";

interface CommunityPostCommentProps {
    comment: Cadmiss.Comment;
    getRepliesByCommentId: (parentCommentId: number | null) => Cadmiss.Comment[] | undefined;
}

export default function CommunityPostComment({
    comment,
    getRepliesByCommentId,
}: CommunityPostCommentProps): JSX.Element {
    const [likingComment, setLikingComment] = useState(comment.clientLiked);
    const [commentLikes, setCommentLikes] = useState(comment.totalLikes);
    const [repliesCollapsed, setRepliesCollapsed] = useState(false);
    const [replyingComment, setReplyingComment] = useState(false);
    const [copiedComment, setCopiedComment] = useState(false);
    const [commentReplies, setCommentReplies] = useState(getRepliesByCommentId(comment.id) ?? []);
    const [commentDeleted, setCommentDeleted] = useState(
        comment.bodyMetadata === Cadmiss.AUTHOR_DELETED_BODY
    );

    const { loggedIn, clientId, clientUsername } = useAppSelector((s) => s.client);

    const dispatch = useAppDispatch();

    const commentBodyRef = useRef<HTMLDivElement>(null); // control body to set inner text when deleted
    const copyCommentBtnRef = useRef<HTMLButtonElement>(null); // store text to copy when share requested

    // change dynamic state when post comment changes
    useEffect(() => {
        setLikingComment(comment.clientLiked);
        setCommentLikes(comment.totalLikes);
        setCommentReplies(getRepliesByCommentId(comment.id) ?? []);
        setCommentDeleted(comment.bodyMetadata === Cadmiss.AUTHOR_DELETED_BODY);
    }, [
        comment.bodyMetadata,
        comment.clientLiked,
        comment.id,
        comment.totalLikes,
        getRepliesByCommentId,
    ]);

    const handleLikeComment = async () => {
        if (!loggedIn) return dispatch(startSigningUp());

        const data = await API.appPostRequest<API.InteractionMap[API.Routes.LikeComment]>(
            `/comments/like-comment/${comment.id}`,
            {},
            { credentials: "include" }
        );
        appConsoleLog(data);

        if (!("actionCompleted" in data)) return;

        // update state
        setLikingComment((prevLikingComment) => !prevLikingComment);
        setCommentLikes((prevCommentLikes) => prevCommentLikes + (likingComment ? -1 : 1));
    };

    const handleToggleReplyingComment = () => {
        if (!loggedIn) return dispatch(startSigningUp());

        setReplyingComment((prevReplying) => !prevReplying);
    };

    const handleReplyComment = async (bodyMetadata: string) => {
        if (!loggedIn || !clientId || !clientUsername) return;

        const data = await API.appPostRequest<API.InteractionMap[API.Routes.CreateComment]>(
            `/comments/${comment.postId}`,
            { parentCommentId: comment.id, bodyMetadata },
            { credentials: "include" }
        );
        appConsoleLog(data);

        setReplyingComment(false);
        if (!("commented" in data)) return;

        // update ui with user comment
        const { commentMetadata } = data;
        setCommentReplies((prevCommentReplies) => {
            return [
                {
                    id: commentMetadata.commentId,
                    postId: comment.postId,
                    authorId: clientId,
                    parentCommentId: comment.id,
                    createdAt: commentMetadata.createdAt,
                    bodyMetadata,

                    authorUsername: clientUsername,
                    clientLiked: false,
                    totalLikes: 0,
                },
                ...prevCommentReplies,
            ];
        });
    };

    const handleCopyCommentText = () => {
        navigator.clipboard.writeText(commentBodyRef.current?.innerText ?? "");

        setCopiedComment(true);
    };

    const handleDeleteComment = async () => {
        if (commentBodyRef.current == null) return;

        const confirmationRequest = confirm("Are you sure?");
        if (!confirmationRequest) return;

        const data = await API.appDeleteRequest<API.InteractionMap[API.Routes.DeleteComment]>(
            `${API.Space.Comments}/${comment.id}`,
            { credentials: "include" }
        );
        appConsoleLog(data);

        if (!("commentDeleted" in data)) return;

        setCommentDeleted(true);
        commentBodyRef.current.innerHTML = Cadmiss.AUTHOR_DELETED_BODY;
    };

    const handleToggleCollapseComment = () => {
        setRepliesCollapsed((prevCollapsed) => !prevCollapsed);
    };

    return (
        <div className="community-post-comment">
            <div className="comment-main-portion">
                <div className="points-container">
                    <div className="points-counter">{commentLikes}</div>
                    <IconButton onClick={handleLikeComment}>
                        {likingComment ? (
                            <ThumbUpIcon className="icon" />
                        ) : (
                            <ThumbUpOffAltIcon className="icon" />
                        )}
                    </IconButton>
                </div>

                <div className="comment-content-container">
                    <div className="header">
                        <div className="comment-info">
                            {commentDeleted ? (
                                <span className="hyperlink">{Cadmiss.AUTHOR_DELETED_USERNAME}</span>
                            ) : (
                                <a
                                    href={`/profile/${comment.authorId}`}
                                    className="hyperlink author-username"
                                >
                                    {comment.authorId}
                                </a>
                            )}{" "}
                            posted {Time.latestTimeAgo(comment.createdAt)} ago
                        </div>
                    </div>

                    <div
                        ref={commentBodyRef}
                        dangerouslySetInnerHTML={{
                            // __html: DOMPurify.sanitize(comment.bodyMetadata),
                            __html: comment.bodyMetadata,
                        }}
                        className="comment-body"
                    />
                </div>
            </div>

            <div className="action-btns-container">
                {!commentDeleted && (
                    <Button
                        className="btn"
                        startIcon={<ReplyIcon />}
                        onClick={handleToggleReplyingComment}
                    >
                        {replyingComment ? "Unreply" : "Reply"}
                    </Button>
                )}

                <Button
                    ref={copyCommentBtnRef}
                    className="btn"
                    startIcon={<ContentCopyIcon />}
                    onClick={handleCopyCommentText}
                >
                    {copiedComment ? "Copied" : "Copy"}
                </Button>

                {clientId === comment.authorId && !commentDeleted && (
                    <Button
                        className="btn"
                        startIcon={<DeleteIcon />}
                        onClick={handleDeleteComment}
                    >
                        Delete
                    </Button>
                )}

                {/* debug */}
                {/* <button
                    onClick={() => console.log(commentReplies)}
                    style={{ background: "black", height: "5vh", cursor: "pointer" }}
                >
                    wut dwebaksjd
                </button> */}
            </div>

            {replyingComment && (
                <div>
                    <CommunityParticipationEditor
                        submitButtonText="Reply"
                        requiredBody
                        maxBodyMetadataLength={Cadmiss.MAX_REPLY_CONTENT_LENGTH}
                        placeholderText="Your reply"
                        onSubmit={handleReplyComment}
                    />
                </div>
            )}

            {commentReplies &&
                commentReplies.length > 0 &&
                (!repliesCollapsed ? (
                    <div className="nested-comments-container">
                        <button
                            className="collapse-comments-line"
                            onClick={handleToggleCollapseComment}
                        />

                        <div className="nested-comments">
                            <CommunityPostCommentList
                                comments={commentReplies}
                                getRepliesByCommentId={getRepliesByCommentId}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="show-replies-container">
                        <Button
                            variant="contained"
                            className="show-replies-btn"
                            onClick={handleToggleCollapseComment}
                        >
                            Show replies
                        </Button>
                    </div>
                ))}
        </div>
    );
}

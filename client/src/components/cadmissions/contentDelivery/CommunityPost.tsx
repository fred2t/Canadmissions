import Button from "@mui/material/Button";
// import DOMPurify from "isomorphic-dompurify";
import CommentIcon from "@mui/icons-material/Comment";
import ShareIcon from "@mui/icons-material/Share";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useEffect, useRef, useState } from "react";
import IconButton from "@mui/material/IconButton";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import DeleteIcon from "@mui/icons-material/Delete";

import { API, Cadmiss, Time } from "../../../utils/namespaces";
import { useAppSelector } from "../../../redux/hooks";
import { appConsoleLog } from "../../../clientDebugging";

interface CommunityPostProps {
    post: Cadmiss.Post;
    fadeEnd?: boolean | undefined;
    unlimitedHeight?: boolean | undefined;
    navigatableTo?: boolean | undefined;
}

export default function CommunityPost({
    post,
    fadeEnd = false,
    unlimitedHeight = false,
    navigatableTo = false,
}: CommunityPostProps): JSX.Element {
    const [postDeleted, setPostDeleted] = useState(post.title === Cadmiss.AUTHOR_DELETED_BODY);
    const [totalLikes, setTotalLikes] = useState(post.totalLikes);

    // handle the body separately to avoid SSR & client-side rendering interferences
    const [bodyMetadata, setBodyMetadata] = useState("");
    const [likedPost, setLikedPost] = useState(post.clientLiked);
    const [textCopied, setTextCopied] = useState(false);

    const { clientId } = useAppSelector((s) => s.client);

    const titleRef = useRef<HTMLAnchorElement>(null);
    const bodyRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        setBodyMetadata(post.bodyMetadata);
        setPostDeleted(post.title === Cadmiss.AUTHOR_DELETED_BODY);
        setTotalLikes(post.totalLikes);
        setLikedPost(post.clientLiked);
    }, [post.bodyMetadata, post.title, post.totalComments, post.totalLikes, post.clientLiked]);

    const handleLikePost = async () => {
        if (postDeleted) return;

        const data = await API.appPostRequest<API.InteractionMap[API.Routes.LikePost]>(
            `/posts/like-post/${post.id}`,
            undefined,
            { credentials: "include" }
        );
        appConsoleLog(data);

        if (!("actionCompleted" in data)) return;

        setLikedPost((prevLiked) => !prevLiked);
        setTotalLikes((prevTotalLikes) => {
            // if the post is liked, clicking the like button will unlike and
            // decrement the like count, likewise for liking the post while unliked
            return prevTotalLikes + (likedPost ? -1 : 1);
        });
    };

    const handleGetPostLink = () => {
        if (typeof window === "undefined") return;

        return `${window.origin}${Cadmiss.postRouteFormatter({ id: post.id, title: post.title })}`;
    };

    const handleSharePost = () => {
        navigator.clipboard.writeText(handleGetPostLink() ?? "");
        setTextCopied(true);
    };

    const handleDeletePost = async () => {
        if (titleRef.current == null || bodyRef.current == null) {
            return;
        }

        const requestConfirmation = confirm("Are you sure?");
        if (!requestConfirmation) return;

        const data = await API.appDeleteRequest<API.InteractionMap[API.Routes.DeletePost]>(
            `/posts/${post.id}`,
            { credentials: "include" }
        );
        appConsoleLog(data);

        titleRef.current.innerText = Cadmiss.AUTHOR_DELETED_BODY;
        bodyRef.current.innerText = Cadmiss.AUTHOR_DELETED_BODY;
        setPostDeleted(true);
    };

    return (
        <div className={`community-post ${unlimitedHeight ? "unlimited-height" : ""}`}>
            <section className="top-bar">
                <div className="post-points-container">
                    <div className="points">{totalLikes}</div>

                    <IconButton className="point-btn" onClick={handleLikePost}>
                        {likedPost ? (
                            <ThumbUpIcon className="icon" />
                        ) : (
                            <ThumbUpOffAltIcon className="icon" />
                        )}
                    </IconButton>
                </div>

                <div className="post-information-container">
                    <div className="community-control-container">
                        <div className="post-metadata">
                            Posted in{" "}
                            <a href={`community/${post.community}`} className="link nav-link">
                                {post.community}
                            </a>{" "}
                            by{" "}
                            {postDeleted ? (
                                <span className="nav-link">{Cadmiss.AUTHOR_DELETED_USERNAME}</span>
                            ) : (
                                <a href="" className="link nav-link">
                                    {post.authorUsername}
                                </a>
                            )}
                            , {Time.latestTimeAgo(post.createdAt)} ago
                        </div>

                        <div className="community-options">
                            <Button startIcon={<CommentIcon />} className="option-btn">
                                <a
                                    href={
                                        navigatableTo ? Cadmiss.postRouteFormatter(post) : undefined
                                    }
                                    className="link"
                                >
                                    {post.totalComments}{" "}
                                    {`Comment${post.totalComments === 1 ? "" : "s"}`}
                                </a>
                            </Button>

                            <Button
                                startIcon={<ShareIcon />}
                                endIcon={<ContentCopyIcon />}
                                className="option-btn"
                                onClick={handleSharePost}
                            >
                                {textCopied ? "Link Copied" : "Share"}
                            </Button>

                            {clientId === post.authorId && !postDeleted && (
                                <Button
                                    startIcon={<DeleteIcon />}
                                    className="option-btn"
                                    onClick={handleDeletePost}
                                >
                                    Delete
                                </Button>
                            )}
                        </div>
                    </div>

                    <a
                        ref={titleRef}
                        className="wrap-down link title"
                        href={navigatableTo ? Cadmiss.postRouteFormatter(post) : undefined}
                    >
                        {post.title}
                    </a>
                </div>
            </section>

            <div className="body-container">
                <a
                    ref={bodyRef}
                    href={navigatableTo ? Cadmiss.postRouteFormatter(post) : undefined}
                    // dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(bodyMetadata) }}
                    dangerouslySetInnerHTML={{ __html: bodyMetadata }}
                    className={`link wrap-down body ${fadeEnd ? "fade-end" : ""}`}
                />
            </div>
        </div>
    );
}

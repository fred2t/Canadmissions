import { GetServerSideProps } from "next";
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { appConsoleLog } from "../../../../clientDebugging";

import CommunityParticipationEditor from "../../../../components/cadmissions/contentDelivery/CommunityParticipationEditor";
import CommunityPost from "../../../../components/cadmissions/contentDelivery/CommunityPost";
import CommunityPostCommentList from "../../../../components/cadmissions/contentDelivery/CommunityPostCommentList";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { startSigningUp } from "../../../../redux/slices/clientSlice";
import { API, Cadmiss } from "../../../../utils/namespaces";

interface PostProps {
    post: Cadmiss.Post;
    comments: Cadmiss.Comment[];
}

export const getServerSideProps: GetServerSideProps<PostProps> = async (context) => {
    const { id } = context.query as { id: string; title: string };

    if (isNaN(+id)) return { notFound: true };

    const data = await API.appGetRequest<API.InteractionMap[API.Routes.GetInteractivePostInfo]>(
        `/posts/${id}`,
        { headers: { [API.HeaderKeys.SSRCookieString]: context.req.headers.cookie ?? "" } }
    );
    appConsoleLog(data);

    if (!("post" in data)) return { notFound: true };

    return {
        props: { ...data },
    };
};

export default function Post({ post, comments }: PostProps): JSX.Element {
    const commentIdToReplies = useMemo<Cadmiss.FormattedReplyStorage>(() => {
        const group = comments.reduce<Cadmiss.FormattedReplyStorage>(
            (acc, comment) => {
                const parentId = Cadmiss.parentIdOrRootKey(comment.parentCommentId);

                // check for existing reply tree
                const parentPrevExisted = acc[parentId] != null;

                return {
                    ...acc,
                    // if there's an existing reply tree, push new comment
                    // else create new tree with the comment as first element
                    [parentId]: parentPrevExisted ? [...acc[parentId], comment] : [comment],
                };
            },
            { root: [] }
        );

        return group;
    }, [comments]);

    const [rootComments, setRootComments] = useState(commentIdToReplies.root);

    const { loggedIn, clientId, clientUsername } = useAppSelector((s) => s.client);
    const dispatch = useAppDispatch();

    useEffect(() => {
        setRootComments(commentIdToReplies.root);
    }, [commentIdToReplies.root]);

    const getRepliesByCommentId = (
        parentCommentId: number | null
    ): Cadmiss.Comment[] | undefined => {
        return commentIdToReplies[Cadmiss.parentIdOrRootKey(parentCommentId)];
    };

    const handleCreateComment = async (bodyMetadata: string) => {
        if (!loggedIn || !clientId || !clientUsername) return dispatch(startSigningUp());

        const data = await API.appPostRequest<API.InteractionMap[API.Routes.CreateComment]>(
            `/comments/${post.id}`,
            { parentCommentId: null, bodyMetadata },
            { credentials: "include" }
        );
        appConsoleLog(data);

        if (!("commented" in data)) return;
        const { commentMetadata } = data;

        // update comment tree
        setRootComments((prevRootComments) => {
            return [
                {
                    id: commentMetadata.commentId,
                    postId: post.id,
                    authorId: clientId,
                    parentCommentId: null,
                    createdAt: commentMetadata.createdAt,
                    bodyMetadata,

                    authorUsername: clientUsername,
                    clientLiked: false,
                    totalLikes: 0,
                },
                ...prevRootComments,
            ];
        });
    };

    return (
        <div className="post-page">
            <Head>
                <title>{post.title}</title>
            </Head>

            <CommunityPost post={post} unlimitedHeight />

            <CommunityParticipationEditor
                onSubmit={handleCreateComment}
                submitButtonText="Comment"
                placeholderText="Your comment"
                requiredBody
                maxBodyMetadataLength={Cadmiss.MAX_COMMENT_CONTENT_LENGTH}
                clearEditorOnSubmit
            />

            <div className="comments-container">
                <div className="comments-container-header">
                    <h2 className="title">Comments</h2>
                </div>

                <CommunityPostCommentList
                    comments={rootComments}
                    getRepliesByCommentId={getRepliesByCommentId}
                />
            </div>
        </div>
    );
}

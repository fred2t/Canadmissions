import { Cadmiss } from "../../../utils/namespaces";

import CommunityPostComment from "./CommunityPostComment";

interface CommunityPostCommentListProps {
    comments: Cadmiss.Comment[];
    getRepliesByCommentId: (parentCommentId: number | null) => Cadmiss.Comment[] | undefined;
}

export default function CommunityPostCommentList({
    comments,
    getRepliesByCommentId,
}: CommunityPostCommentListProps): JSX.Element {
    return (
        <div className="community-post-comment-list">
            {comments.map((comment) => (
                <CommunityPostComment
                    key={comment.id}
                    comment={comment}
                    getRepliesByCommentId={getRepliesByCommentId}
                />
            ))}
        </div>
    );
}

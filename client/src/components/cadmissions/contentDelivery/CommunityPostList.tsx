import { Cadmiss } from "../../../utils/namespaces";

import CommunityPost from "./CommunityPost";

interface CommunityPostListProps {
    posts: Cadmiss.Post[];
}

export default function CommunityPostList({ posts }: CommunityPostListProps): JSX.Element {
    return (
        <div className="community-posts-list">
            {posts.map((post) => (
                <CommunityPost key={post.id} post={post} navigatableTo fadeEnd />
            ))}
        </div>
    );
}

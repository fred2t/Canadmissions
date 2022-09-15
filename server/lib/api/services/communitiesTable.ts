import { dbPool } from "../../config/database";
import { Cadmiss, DB } from "../../utils/namespaces";
import { appConsoleLog } from "../../zControl/serverDebugging";

// DANGER: ONLY USE FOR DEV
// export async function getAllCommunityPosts(community: Cadmiss.SchoolAcronyms) {
//     // @ts-ignore
//     const [result] = await dbPool.execute<DB.PostsRow[]>(
//         "select * from posts where community=(?)",
//         [community]
//     );

//     return result;
// }

export async function selectCommunityCadmissPosts({
    userId,
    community,
}: {
    userId: number | null;
    community: Cadmiss.SchoolAcronyms;
}) {
    // @ts-ignore
    const [reslt] = await dbPool.execute<Cadmiss.Post[]>(
        `
        SELECT
            posts.*,
            COUNT(DISTINCT(comments.id)) AS totalComments,
            users.username AS authorUsername,
            COUNT(DISTINCT(post_likes.userId)) AS totalLikes,
            SUM(IF(post_likes.userId = :userId, 1, 0)) > 0 AS clientLiked
        FROM
            posts
            LEFT JOIN comments ON posts.id = comments.postId
            LEFT JOIN users ON posts.authorId = users.id
            LEFT JOIN post_likes ON posts.id = post_likes.postId
        WHERE
            community = :community 
        GROUP BY
            posts.id
        ORDER BY
            totalLikes DESC,
            createdAt
        LIMIT
            35`,
        { userId, community, currentEpoch: Date.now() }
    );

    return reslt;
}

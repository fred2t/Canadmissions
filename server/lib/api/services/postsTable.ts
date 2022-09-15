import { FieldPacket } from "mysql2";
import { dbPool } from "../../config/database";
import { Cadmiss, DB } from "../../utils/namespaces";

export async function existUserLikePost({ postId, userId }: { postId: number; userId: number }) {
    // @ts-ignore
    const [reslt] = await dbPool.execute<[{ liked: 1 | 0 }]>(
        `
        SELECT 
        EXISTS(SELECT '' FROM post_likes WHERE postId = :postId AND userId = :userId) 
        AS liked`,
        { postId, userId }
    );

    return Boolean(reslt[0].liked);
}

export async function selectPostById(postId: number) {
    // @ts-ignore
    const [reslt] = await dbPool.execute<[DB.PostsRow] | []>(
        `SELECT * FROM posts WHERE id = :postId LIMIT 1`,
        { postId }
    );

    return reslt[0];
}

export async function selectInteractivePostById({
    postId,
    userId,
}: {
    postId: number;
    userId: number | null;
}) {
    // @ts-ignore
    const [reslt] = await dbPool.execute<[Cadmiss.Post] | []>(
        `
        SELECT
            posts.*,
            users.username as authorUsername,
            COUNT(DISTINCT(comments.id)) AS totalComments,
            COUNT(DISTINCT(post_likes.userId)) AS totalLikes,
            SUM(IF(post_likes.userId = :userId, 1, 0)) > 0 AS clientLiked
        FROM
            posts
            LEFT JOIN comments ON posts.id = comments.postId
            LEFT JOIN users ON posts.authorId = users.id
            LEFT JOIN post_likes ON posts.id = post_likes.postId
        WHERE
            posts.id = :postId
        GROUP BY
            posts.id
        ORDER BY
            totalLikes DESC,
            createdAt`,
        { userId, postId }
    );

    return reslt[0];
}

export async function selectTrendingPosts({ userId }: { userId: number | null }) {
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
        GROUP BY
            posts.id
        ORDER BY
            totalLikes DESC,
            createdAt
        LIMIT
            35
        `,
        { userId, currentEpoch: Date.now() }
    );

    return reslt;
}

export async function selectCadmissPostsByUserFollowedCommunities({
    userFollowedCommunities,
    userId,
}: {
    userId: number;
    userFollowedCommunities: Cadmiss.SchoolAcronyms[];
}) {
    console.log(
        userFollowedCommunities,
        "and",
        `${userFollowedCommunities
            .map((communityAcronym) => `community = '${communityAcronym}'`)
            .join(" OR ")}`
    );

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
            ${userFollowedCommunities
                .map((communityAcronym) => `community = '${communityAcronym}'`)
                .join(" OR ")}
        GROUP BY
            posts.id
        ORDER BY
            totalLikes DESC,
            createdAt
        LIMIT
            35`,
        { userId, currentEpoch: Date.now() }
    );

    return reslt;
}

export function insertNewPost(newPostInfo: Omit<DB.PostsRow, "id" | "bodyChanged">) {
    // @ts-ignore
    return dbPool.execute<DB.InsertResultSetHeader>(
        `INSERT INTO posts (createdAt, community, authorId, title, bodyMetadata) 
        VALUES (:createdAt, :community, :authorId, :title, :bodyMetadata)`,
        newPostInfo
    );
}

export async function toggleLikeDbCadmissPost({
    postId,
    userId,
}: {
    postId: number;
    userId: number;
}): Promise<[DB.InsertResultSetHeader | DB.DeleteResultSetHeader, FieldPacket[]]> {
    const userAlreadyLiking = await existUserLikePost({ postId, userId });

    // delete their like
    if (userAlreadyLiking) {
        // @ts-ignore
        return dbPool.execute<DB.DeleteResultSetHeader>(
            `
            DELETE FROM post_likes WHERE userId = :userId AND postId = :postId`,
            { userId, postId }
        );

        // add a like row to acknowledge
    } else {
        // @ts-ignore
        return dbPool.execute<DB.InsertResultSetHeader>(
            `INSERT INTO post_likes (userId, postId) VALUES (:userId, :postId)`,
            { userId, postId }
        );
    }
}

export function deleteDbCadmissPost({ postId, authorId }: { postId: number; authorId: number }) {
    // @ts-ignore
    return dbPool.execute<DB.DeleteResultSetHeader>(
        `
        UPDATE posts 
        SET title = :title, bodyMetadata = :bodyMetadata 
        WHERE id = :id AND authorId = :authorId`,
        {
            id: postId,
            authorId,
            title: Cadmiss.AUTHOR_DELETED_BODY,
            bodyMetadata: Cadmiss.AUTHOR_DELETED_BODY,
        }
    );
}

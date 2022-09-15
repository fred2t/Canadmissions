import { dbPool } from "../../config/database";
import { Cadmiss, DB } from "../../utils/namespaces";
import { appConsoleLog } from "../../zControl/serverDebugging";

export async function existsParentCommentId(parentId: number) {
    // @ts-ignore
    const [reslt] = await dbPool.execute<[{ exists: 1 | 0 }]>(
        `
        SELECT EXISTS(SELECT '' FROM comments WHERE id = :parentId)
        AS exists`,
        { parentId }
    );

    return Boolean(reslt[0].exists);
}

export async function existsUserLikeComment({
    commentId,
    userId,
}: {
    userId: number;
    commentId: number;
}) {
    // @ts-ignore
    const [reslt] = await dbPool.execute<[{ liked: 1 | 0 }]>(
        `
        SELECT 
        EXISTS(SELECT '' FROM comment_likes WHERE commentId = :commentId AND userId = :userId) 
        AS liked`,
        { userId, commentId }
    );

    return Boolean(reslt[0].liked);
}

// DANGER: ONLY USE FOR DEVELOPMENT
// export async function selectCommentsByPostId(postId: number) {
//     // @ts-ignore
//     const [reslt] = await dbPool.execute<DB.CommentsRow[]>(
//         `SELECT * from comments WHERE postId = :postId`,
//         { postId }
//     );

//     return reslt;
// }

export async function selectInteractiveCommentsByPostId({
    postId,
    clientId,
}: {
    postId: number;
    clientId: number | null;
}) {
    // @ts-ignore
    const [reslt] = await dbPool.execute<Cadmiss.Comment[]>(
        `
        SELECT
            comments.*,
            users.username AS authorUsername,
            COUNT(DISTINCT(comment_likes.userId)) AS totalLikes,
            SUM(IF(comment_likes.userId = :userId, 1, 0)) > 0 AS clientLiked
        FROM
            comments
            LEFT JOIN users ON comments.authorId = users.id
            LEFT JOIN comment_likes ON comments.id = comment_likes.commentId
        WHERE
            comments.postId = :postId
        GROUP BY
            comments.id
        ORDER BY 
            totalLikes DESC,
            createdAt
        LIMIT 55`,
        { postId, userId: clientId }
    );

    return reslt;
}

export function insertRootComment({
    postId,
    bodyMetadata,
    createdAt,
    parentCommentId,
    authorId,
}: Omit<DB.CommentsRow, "id"> & { parentCommentId: null }) {
    appConsoleLog({ postId, authorId, parentCommentId, createdAt, bodyMetadata });

    // @ts-ignore
    return dbPool.execute<DB.InsertResultSetHeader>(
        `
        INSERT INTO comments (postId, authorId, parentCommentId, createdAt, bodyMetadata)
        VALUES (:postId, :authorId, :parentCommentId, :createdAt, :bodyMetadata)`,
        { postId, authorId, parentCommentId, createdAt, bodyMetadata }
    );
}

export function insertChildComment({
    authorId,
    bodyMetadata,
    createdAt,
    parentCommentId,
    postId,
}: Omit<DB.CommentsRow, "id"> & { parentCommentId: number }) {
    /**
     * Only insert if there's an existing comment with an id equal to the
     * given parent id.
     */

    // @ts-ignore
    return dbPool.execute<DB.InsertResultSetHeader>(
        `
        INSERT INTO comments (postId, authorId, parentCommentId, createdAt, bodyMetadata)
        SELECT :postId, :authorId, :parentCommentId, :createdAt, :bodyMetadata
        WHERE (SELECT EXISTS(SELECT '' FROM comments WHERE id = :parentCommentId))`,
        { postId, authorId, parentCommentId, createdAt, bodyMetadata }
    );
}

export async function toggleLikeDbCadmissComment({
    commentId,
    userId,
}: {
    commentId: number;
    userId: number;
}) {
    const commentAlreadyLiked = await existsUserLikeComment({ commentId, userId });

    if (commentAlreadyLiked) {
        return dbPool.execute(
            `DELETE FROM comment_likes WHERE commentId = :commentId AND userId = :userId`,
            { commentId, userId }
        );
    } else {
        return dbPool.execute(
            `INSERT INTO comment_likes (commentId, userId) VALUES (:commentId, :userId)`,
            { commentId, userId }
        );
    }
}

export function deleteDbCadmissComment({
    authorId,
    commentId,
}: {
    commentId: number;
    authorId: number;
}) {
    return dbPool.execute(
        `
        UPDATE comments 
        SET bodyMetadata = :bodyMetadata 
        WHERE id = :id AND authorId = :authorId`,
        { id: commentId, authorId, bodyMetadata: Cadmiss.AUTHOR_DELETED_BODY }
    );
}

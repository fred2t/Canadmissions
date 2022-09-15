SELECT
	comments.*,
	users.username AS authorUsername,
	COUNT(DISTINCT(comment_likes.userId)) AS totalLikes,
	comment_likes.userId = 1 AS clientLiked
FROM
	comments
	LEFT JOIN users ON comments.authorId = users.id
	LEFT JOIN comment_likes ON comments.id = comment_likes.commentId
WHERE
	comments.postId = 3
GROUP BY
	comments.id
LIMIT
	55
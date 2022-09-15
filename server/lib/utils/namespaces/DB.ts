import { Cadmiss } from ".";

// tables
export interface UsersRow {
    id: number;
    username: string;
    email: string;
    password: string;
}

export interface CommunitiesRow {
    community: Cadmiss.SchoolAcronyms;
}

export interface JoinedCommunitiesRow {
    community: Cadmiss.SchoolAcronyms;
    userId: number;
}

/**
 * -- within last 5 month epoch time
 * AND (posts.createdAt + 12960000000) > :currentEpoch
 */
export interface PostsRow {
    id: number;
    community: Cadmiss.SchoolAcronyms;

    // epoch time
    createdAt: number;
    authorId: number;
    title: string;
    bodyMetadata: string;
    bodyChanged: boolean | 1 | 0;
}

export interface CommentsRow {
    id: number;
    postId: number;
    authorId: number;
    parentCommentId: number | null;
    createdAt: number;
    bodyMetadata: string;
}

// db query responses
export interface ResultSetHeader {
    fieldCount: number;
    affectedRows: number;
    insertId: number;
    info: string;
    serverStatus: number;
    warningStatus: number;
}

export interface InsertResultSetHeader extends ResultSetHeader {}

export interface UpdateResultSetHeader extends ResultSetHeader {
    changedRows: number;
}

export interface DeleteResultSetHeader extends ResultSetHeader {}

// utils
export interface MySQLErrorObject {
    message: string;
    code: MySQLErrorCodes;
    errno: number;
    sql: string;
    sqlState: string;
    sqlMessage: string;
}

export enum MySQLErrorCodes {
    ER_DUP_ENTRY = "ER_DUP_ENTRY",
}

export function getDuplicatedColumn<C extends Readonly<string>>(
    dbError: MySQLErrorObject,
    tableName: string
): C {
    /**
     * Find which column caused the @var MySQLErrorCodes.ER_DUP_ENTRY error.
     */

    const splitsByTable = dbError.message.split(`${tableName}.`);
    const columnSplit = splitsByTable[1];

    // get rid of the apostrophe at the end of the column name
    const duplicatedColumn = columnSplit.slice(0, -1);

    // forcing the type to be whatever the argument it's acting as is
    // aka. trust that i typed the method correctly
    return duplicatedColumn as unknown as C;
}

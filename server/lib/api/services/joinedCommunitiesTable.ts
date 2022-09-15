import { dbPool } from "../../config/database";
import { Cadmiss, DB } from "../../utils/namespaces";
import { appConsoleLog } from "../../zControl/serverDebugging";

export async function selectIsCommunityMember(userId: number, community: Cadmiss.SchoolAcronyms) {
    appConsoleLog("userId: ", userId, "community: ", community);

    // @ts-ignore
    const [reslt] = await dbPool.execute<[{ joined: 1 | 0 }]>(
        `
        SELECT EXISTS(
        SELECT '' FROM joined_communities 
        WHERE userId = :userId AND community = :community) AS joined`,
        { userId, community }
    );
    appConsoleLog(reslt);

    return Boolean(reslt[0].joined);
}

export async function selectAllUserJoinedCommunities(userId: number) {
    const [reslt] = await dbPool.execute<
        // @ts-ignore
        [{ joinedCommunities: Cadmiss.SchoolAcronyms[] }] | null
    >(
        `
        SELECT JSON_ARRAYAGG(community) AS joinedCommunities 
        FROM joined_communities 
        WHERE userId = :userId`,
        { userId }
    );

    return reslt == null ? null : reslt[0].joinedCommunities;
}

export function insertCommunityMember(userId: number, community: Cadmiss.SchoolAcronyms) {
    // @ts-ignore
    return dbPool.execute<DB.InsertResultSetHeader>(
        `INSERT INTO joined_communities (userId, community) VALUES (:userId, :community)`,
        { userId, community }
    );
}

export function deleteCommunityMember(userId: number, community: Cadmiss.SchoolAcronyms) {
    // @ts-ignore
    return dbPool.execute<DB.DeleteResultSetHeader>(
        "DELETE FROM joined_communities WHERE userId = :userId AND community = :community",
        { userId, community }
    );
}

import { dbPool } from "../../config/database";
import { DB } from "../../utils/namespaces";

export async function selectUserByUsername(username: string) {
    // @ts-ignore
    const [result] = await dbPool.execute<[DB.UsersRow] | []>(
        "SELECT * FROM users WHERE username = :username LIMIT 1",
        { username }
    );

    return result[0];
}

export async function selectUserByEmail(email: string) {
    // @ts-ignore
    const [result] = await dbPool.execute<[DB.UsersRow] | []>(
        "SELECT * FROM users WHERE email = :email LIMIT 1",
        { email }
    );

    return result[0];
}

export function insertNewUser(userRow: Omit<DB.UsersRow, "id">) {
    // @ts-ignore
    return dbPool.execute<DB.InsertResultSetHeader>(
        "INSERT INTO users (username, email, password) VALUES (:username, :email, :password)",
        userRow
    );
}

export function updateUsernameWithId(id: number, username: string) {
    // @ts-ignore
    return dbPool.execute<DB.UpdateResultSetHeader>(
        "UPDATE users SET username = :username WHERE id = :id",
        { id, username }
    );
}

export function updatePasswordWithUsername(username: string, hashedNewPassword: string) {
    // @ts-ignore
    return dbPool.execute<DB.UpdateResultSetHeader>(
        "UPDATE users SET password = :password WHERE username = :username",
        { username, password: hashedNewPassword }
    );
}

export function deleteUserById(id: number) {
    return dbPool.execute("DELETE FROM users WHERE id = :id", { id });
}

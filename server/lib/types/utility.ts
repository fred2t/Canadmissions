import mysql from "mysql2";

export interface ServerBuildSettings {
    PORT: number;
    CLIENT_URL: string;
    JWT_SECRET_KEY: string;
    DB_CONFIG: mysql.PoolOptions;

    RECAPTCHA_SECRET_KEY?: string | undefined;
}

import dotenv from "dotenv";
import fs from "fs";

import { DbSSL } from "./fileMaps";
import { notValueNestedCheck } from "../zControl/serverDebugging";
import { NodeEnvironments } from "../utils/enums";
import { SERVER_BUILD_ENVIRONMENT } from "../.app/serverBuildEnv";
import { ServerBuildSettings } from "../types/utility";

dotenv.config();

const {
    PORT,
    CLIENT_URL,
    JWT_SECRET_KEY,

    // db
    DB_USER,
    DB_PASSWORD,
    DB_DATABASE,
    DB_HOST,
    DB_PORT,

    // RECAPTCHA_SECRET_KEY,
} = process.env;

export const ENVS: ServerBuildSettings = {
    PORT: Number(PORT) || 3001,
    CLIENT_URL: CLIENT_URL as string,
    JWT_SECRET_KEY: JWT_SECRET_KEY as string,
    // RECAPTCHA_SECRET_KEY: RECAPTCHA_SECRET_KEY as string,

    // no need to check if this the path doesn't exist myself since
    // readFileSync will throw an error if it doesn't
    DB_CONFIG: {
        user: DB_USER as string,
        password: DB_PASSWORD as string,
        database: DB_DATABASE as string,
        host: DB_HOST as string,

        // targetted to GCP Cloud Run + Cloud SQL btw
        ...(SERVER_BUILD_ENVIRONMENT === NodeEnvironments.Production && {
            // if the port is undefined, it will be converted to 0 by Number()
            // which is converted to undefined which will be triggered by the
            // notValueNestedCheck function
            port: (Number(DB_PORT) || undefined) as number,
            ssl: {
                ca: fs.readFileSync(DbSSL.ServerCa).toString(),
                key: fs.readFileSync(DbSSL.ClientKey).toString(),
                cert: fs.readFileSync(DbSSL.ClientCert).toString(),
            },
        }),
    },
};
notValueNestedCheck(ENVS, undefined);

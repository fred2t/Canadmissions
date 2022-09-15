import cors from "cors";
import { ENVS } from "./serverEnvVars";

export const DEFAULT_CORS_SETTINGS: cors.CorsOptions = {
    origin: ENVS.CLIENT_URL,
    credentials: true,
};

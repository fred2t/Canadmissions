import { notValueNestedCheck } from "../src/clientDebugging";
import { ClientBuildSettings } from "../src/types/utility";

const { NEXT_PUBLIC_API_BASE } = process.env;

export const ENVS: ClientBuildSettings = {
    BASE_URL: NEXT_PUBLIC_API_BASE as string,
    WS_BASE_URL: NEXT_PUBLIC_API_BASE?.replace("https://", "wss://").replace(
        "http://",
        "ws://"
    ) as string,

    // GOOGLE_SSO_CLIENT_ID: NEXT_PUBLIC_GOOGLE_SSO_CLIENT_ID as string,
};
notValueNestedCheck(ENVS, undefined);

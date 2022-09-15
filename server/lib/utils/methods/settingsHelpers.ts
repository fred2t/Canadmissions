import { SERVER_BUILD_ENVIRONMENT } from "../../.app/serverBuildEnv";
import { NodeEnvironments } from "../enums";

export function xIfDevElseY<T>(ifDev: T, ifProd: T): T {
    return SERVER_BUILD_ENVIRONMENT === NodeEnvironments.Development ? ifDev : ifProd;
}

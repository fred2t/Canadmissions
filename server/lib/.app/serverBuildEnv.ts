import dotenv from "dotenv";
import { NodeEnvironments } from "../utils/enums";

dotenv.config();
const { SERVER_BUILD_ENVIRONMENT } = process.env;

// check if environment is valid
if (
    Object.values(NodeEnvironments as Record<string, unknown>).includes(
        SERVER_BUILD_ENVIRONMENT
    ) === false
) {
    throw new Error(`Invalid environment type: ${SERVER_BUILD_ENVIRONMENT}`);
}
export { SERVER_BUILD_ENVIRONMENT };

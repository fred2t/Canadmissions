import { initializedApplication } from "../config/application";
import { initializedServer } from "../config/server";

export const application = initializedApplication();
export const server = initializedServer({}, application);

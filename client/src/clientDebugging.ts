import { CLIENT_BUILD_ENVIRONMENT } from "../.app/clientBuildEnv";

import { NodeEnvironments } from "./utils/enums";
import { isConcreteObject } from "./utils/methods/objectHelpers";

export function appConsoleLog(...data: any[]): void {
    if (CLIENT_BUILD_ENVIRONMENT === NodeEnvironments.Development) {
        console.log(...data);
    }
}

export function xIfDevElseY<T>(ifDev: T, ifProd: T): T {
    /**
     * Return the first argument if the current client build
     * evnrionemtn is set to 'Development' otherwise return
     * the second.
     */

    return CLIENT_BUILD_ENVIRONMENT === NodeEnvironments.Development ? ifDev : ifProd;
}

export function notValueNestedCheck<O extends object>(
    obj: O,
    ...disallowedValues: unknown[]
): void {
    /**
     * Check if object has any property with disallowed value.
     * @param obj - object to check
     * @param disallowedValue - value to check for
     * @throws Error if object has any property with disallowed value
     * @returns void
     */

    for (const [key, value] of Object.entries(obj)) {
        const isDisallowedValue = disallowedValues.includes(value);

        if (isDisallowedValue) {
            throw new Error(
                `Self-err: object '${key}' is value: '${value}'`
            );
        } else if (isConcreteObject(value)) {
            notValueNestedCheck(value, ...disallowedValues);
        }

        // if nested value is valid, no code will run or be hanging
        // so do nothing
    }
}

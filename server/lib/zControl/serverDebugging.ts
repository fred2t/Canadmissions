import { isConcreteObject } from "../utils/methods/objectHelpers";
import { NodeEnvironments } from "../utils/enums";
import { SERVER_BUILD_ENVIRONMENT } from "../.app/serverBuildEnv";

export function appConsoleLog(...data: any[]): void {
    if (SERVER_BUILD_ENVIRONMENT === NodeEnvironments.Development) {
        console.log(...data);
    }
}

export function noNullishValuesCheck<O extends object>(obj: O): void {
    /**
     * Separating null and undefined checks on purpose
     */

    for (const [key, value] of Object.entries(obj)) {
        switch (value) {
            case undefined:
                throw new Error(`P: Object has undefined value for key: ${key}`);
            case null:
                console.warn(`P: Object has null value key, ${key}`);
        }

        // nan can't be matched with ===
        if (isNaN(value)) {
            throw new Error(`P: Object has NaN value for key: ${key}`);
        }
    }
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

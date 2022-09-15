// prettier-ignore
export function objectFill<T extends object, F extends Readonly<string>>(obj: T, fillWith: F): Record<keyof T, F>;
export function objectFill<T extends object>(obj: T): Record<keyof T, "">;
export function objectFill<T extends object>(obj: T, fillWith: unknown = ""): object {
    /**
     * Clear all values in an object.
     * @param obj Object to clear values in.
     * @param fillWith Value to fill with.
     * @returns Object with cleared values.
     * @example
     * objectFill({ a: 1, b: 2 }) // { a: "", b: "" }
     * objectFill({ a: 1, b: 2 }, "") // { a: "", b: "" }
     * objectFill({ a: 1, b: 2 }, "foo") // { a: "foo", b: "foo" }
     */

    return Object.fromEntries(Object.entries(obj).map(([key]) => [key, fillWith]));
}

export function isConcreteObject(obj: unknown): boolean {
    /**
     * Check if object and not null or undefined which are
     * considered objects with js's typeof method.
     */

    return typeof obj === "object" && !Array.isArray(obj) && obj !== null;
}

export function concreteObjectCopy<T extends Record<string, unknown>>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

// type KeyofUnion<T> = T extends object ? keyof T : never;
export function hasKey<T extends object, K extends T extends object ? keyof T : never>(
    object: T,
    key: K
) {
    /**
     * Type checking for 'in' keyword to support unioned types.
     */

    return key in object;
}

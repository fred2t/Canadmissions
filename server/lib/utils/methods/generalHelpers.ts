export function JSONParsedOrReturn(toParse: string): string | Record<string, unknown> {
    try {
        return JSON.parse(toParse);
    } catch (e) {
        return toParse;
    }
}

export function getRandomInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
}

export function randomChoice<T extends string | unknown[]>(arr: T): T[number] {
    return arr[getRandomInt(arr.length - 1)];
}

export function simpleUUID(length: number) {
    const lcLetsNumbs = "abcdefghijklmnopqrstuvwxyz0123456789";

    return Array.from({ length }, () => randomChoice(lcLetsNumbs)).join("");
}

export function removeSpaces(str: string): string {
    /**
     * Removes all spaces from a string.
     * Created because sometimes .replaceAll doesn't work due to interpreter
     * config.
     */

    return str.replace(/\s/g, "");
}

export function objectCopy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

export async function sleep(ms = 1000) {
    return new Promise((res) => setTimeout(res, ms));
}

export function coinFlip(): boolean {
    return Math.random() < 0.5;
}

export function appJSONStringify<T>(obj: T) {
    return JSON.stringify(obj);
}

export function parseCookieString(str: string) {
    if (!str) return {};

    return str.split(";").reduce<Record<string, string>>((acc, cur) => {
        const pair = cur.split("=");
        return { ...acc, [pair[0].trim()]: pair[1] };
    }, {});
}

import { sumArray } from "./arrayHelpers";

export function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function camelCaseSentence(str: string) {
    return str
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}

export function getRandomInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
}

export function randomChoice<T extends string | unknown[]>(arr: T): T[number] {
    return arr[getRandomInt(arr.length - 1)];
}

export function splitLinesByLength(text: string, maxLength: number): string[] {
    /**
     * Splits a string into lines of maxLength length.
     * If the string is shorter than maxLength, it will return a single line.
     * If the string is longer than maxLength, it will return multiple lines.
     * @param text
     * @param maxLength
     * @returns {string[]}
     * @example
     * splitLinesByLength("hello world", 5)
     * // returns ["hello", "world"]
     * splitLinesByLength("hello world", 10)
     * // returns ["hello world"]
     */

    const words = text.split(" ");
    const lines: string[] = [];

    words.reduce<string[]>((acc, word, index) => {
        if (sumArray(acc.map((line) => line.length)) + word.length >= maxLength) {
            // happens if the single word is longer than the maxLength
            if (acc.length === 0) {
                lines.push(word);
            } else {
                lines.push(acc.join(" "));
            }

            return [word];
        }

        if (index === words.length - 1) {
            lines.push([...acc, word].join(" "));
        }

        // if nothing returned at this point, there was no new line
        // so we can just add the word to the current line
        return [...acc, word];
    }, []);

    return lines;
}

export function simpleUUID(length: number) {
    const lcLetsNumbs = "abcdefghijklmnopqrstuvwxyz0123456789";

    return Array.from({ length }, () => randomChoice(lcLetsNumbs)).join("");
}

export function JSONParsedOrReturn(toParse: string): string | Record<string, unknown> {
    try {
        return JSON.parse(toParse);
    } catch (e) {
        return toParse;
    }
}

export function appJSONStringify<T>(obj: T) {
    return JSON.stringify(obj);
}

export function partialCall<T extends unknown[], U extends unknown[], R>(
    f: (...args: [...T, ...U]) => R,
    ...headArgs: T
): (...tailArgs: U) => R {
    return (...tailArgs: U) => f(...headArgs, ...tailArgs);
}

export async function sleep(ms: number = 1000) {
    return new Promise((res) => setTimeout(res, ms));
}

export function simpleMemoize<A, R>(func: (value: A) => R) {
    const cache = new Map<A, R>();

    return function (value: A): R {
        const cachedResult = cache.get(value);
        if (cachedResult != undefined) return cachedResult;

        const result = func(value);
        cache.set(value, result);
        return result;
    };
}

export function roundDecimal(numToRound: number, decimalPlaces: number) {
    return Math.round(numToRound * 100) / Math.pow(10, decimalPlaces);
}

export function removeSpaceAndNL(str: string) {
    /**
     * Remove spaces and new lines.
     */

    return str.replaceAll(" ", "").replaceAll("\n", "");
}

export function myReplaceAll(
    arraylike: string | unknown[],
    replacedValue: unknown,
    newValue: unknown
) {
    return Array.from(arraylike, (value, i) => {
        if (value === replacedValue) return newValue;
        return value;
    });
}

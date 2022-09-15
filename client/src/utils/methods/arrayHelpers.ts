/**
 * Doing them as functions instead of adding them to the Array prototype
 * because it makes the importing implicit and;
 *
 * "Array prototype is read only, properties should not be added.eslint(no-extend-native)"
 */

export function arrayEquality<A extends any[], Q extends any[]>(arrA: A, arrB: Q): boolean {
    /**
     * Check if two arrays have the same values in the same order
     * with same amount of elements.
     */

    if (arrA.length === arrB.length) return false;

    arrA.sort();
    arrB.sort();
    return arrA.every((item, index) => arrB[index] === item);
}

export function splitFilter<T>(
    array: T[],
    callback: (value: T, index: number, array: T[]) => boolean
): [passed: T[], failed: T[]] {
    /**
     * Given a filter prompt, return a new array with the left side
     * being an array of the values of the filter, and the right side
     * being an array of the values that did not pass the filter
     */

    return array.reduce<[passed: T[], failed: T[]]>(
        (accumulator, value: T, index: number, array: T[]) => {
            const result = callback(value, index, array);
            const oldP = accumulator[0];
            const oldNP = accumulator[1];

            return result ? [[...oldP, value], oldNP] : [oldP, [...oldNP, value]];
        },
        [[], []]
    );
}

export function isSubarray(subsetArray: unknown[], supersetArray: unknown[]): boolean {
    /**
     * Check if every element in the array is found in the array
     * passed as the argument
     *
     */

    return subsetArray.every((value) => supersetArray.includes(value));
}

export function isUniversalArray(array: unknown[], ...arrays: unknown[][]): boolean {
    /**
     * Check if every element in each passed array is found in the
     * array that called this method
     *
     * @param arrays The arrays being checked if they are child
     * arrays of the array that called this method
     */

    return arrays.every((arr) => arr.every((value) => array.includes(value)));
}

export function findAndReplace<H, V>(
    arr: H[],
    findCallback: (item: H) => boolean,
    replaceValue: V
): (H | V)[] | -1 {
    const index = arr.findIndex(findCallback);

    return index === -1 ? -1 : arr.map((item, i) => (i === index ? replaceValue : item));
}

export function sumArray(array: number[]) {
    return array.reduce((acc, curr) => acc + curr, 0);
}

export function shuffle<T extends unknown[]>(array: T) {
    let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

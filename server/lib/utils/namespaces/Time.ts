export enum TimeMetric {
    MS = "millisecond",
    SEC = "second",
    MIN = "minute",
    HOUR = "hour",
    DAY = "day",
    WEEK = "week",
    MONTH = "month",
    YEAR = "year",
}

export const CONSECUTIVE_NUMERICAL_TIME_CONVERSIONS: {
    /**
     * The numbers you need to divide from the previous key in the object to get
     * to the time representation.
     */
    [TR in TimeMetric]: number;
} = Object.freeze({
    millisecond: 1,
    second: 1000,
    minute: 60,
    hour: 60,
    day: 24,
    week: 7,
    month: 365 / 12 / 7,
    year: 12,
});

// methods
export function currentEpochTime(): number {
    /**
     * Returns epoch time.
     */

    return new Date().getTime();
}

export function epochNumerialConverter(epochTime: number, convertTo: TimeMetric): number {
    let newNumericalTime = epochTime;
    for (const [key, value] of Object.entries(CONSECUTIVE_NUMERICAL_TIME_CONVERSIONS)) {
        newNumericalTime /= value;
        if (key === convertTo) break;
    }

    return newNumericalTime;
}

export function isInEopchTimeRange(
    start: number,
    end: number,
    exclusiveRange: number,
    epochRepresentation: TimeMetric = TimeMetric.MS
): boolean {
    /**
     * Assumes that the start and end times are in the same epoch representation.
     *
     * @param start The start time.
     * @param end The end time.
     * @param exclusiveRange The range of time that is not included in the range.
     * @param epochRepresentation The epoch representation of the start and end times.
     * @returns Whether the time is in the range.
     */

    return epochNumerialConverter(end - start, epochRepresentation) < exclusiveRange;
}

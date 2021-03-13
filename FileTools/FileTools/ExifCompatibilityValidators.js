/**
 * @typedef {import("./ExifHelper.js").default} ExifHelper
 * */

class ExifCompatibilityValidator {
    /**
     *
     * @param {ExifHelper} infoA
     * @param {ExifHelper} infoB
     * @returns {boolean} True if the two photos PROBABLY belong into the same sequence
     */
    areCompatible(infoA, infoB) {
        throw new Error("Not implemented.");
    }
}

class Always extends ExifCompatibilityValidator {
    constructor(constResult = false) {
        super();
        this.constResult = !!constResult;
    }
    areCompatible(infoA, infoB) {
        return this.constResult;
    }
}
Always.True = new Always(true);
Always.False = new Always(false);

class TimedSequence extends ExifCompatibilityValidator {
    /**
     *
     * @param {number} maxDelay max delay between photos, seconds
     * @param {number} apertureTolerance
     * @param {number} timeTolerance
     */
    constructor(maxDelay, apertureTolerance = 0.00001, timeTolerance = 0.001) {
        super();
        this.maxDelay = maxDelay;
        this.apertureTolerance = apertureTolerance;
        this.timeTolerance = timeTolerance;
    }
    get maxDelayMs() {
        return this.maxDelay * 1000;
    }
    /**
     *
     * @param {ExifHelper} a
     * @param {ExifHelper} b
     */
    areCompatible(a, b) {
        if (!diffWithinTolerance(a.dateTakenMs, b.dateTakenMs, this.maxDelayMs)) {
            console.log("Time diff fail ", a.fileName, " and ", b.fileName, " diff=", Math.abs(a.dateTakenMs - b.dateTakenMs)/1000);
            return false;
        }
        if (!diffWithinTolerance(a.fStop, b.fStop, this.apertureTolerance)) {
            return false;
        }
        if (!diffWithinTolerance(a.exposureTime, b.exposureTime, this.timeTolerance)) {
            return false;
        }
        return true;
    }
}

function diffWithinTolerance(x, y, tolerance = 0) {
    return Math.abs(x - y) < tolerance;
}



export {
    ExifCompatibilityValidator,
    TimedSequence,
    Always
};
import ExifPromise from "./ExifPromise.js";
import * as path from "path";
const REGEX_MATCH_EXIF_DATE = /([0-9]{4}):([0-9]{2}):([0-9]{2})\s([0-9]{2}):([0-9]{2}):([0-9]{2})/;

class ExifHelper {
    /**
     * @param {string} filePath
     * @param {import("./ExifPromise.js").ExifInfo} exif
     */
    constructor(exif, filePath) {
        this.exif = exif;
        this.filePath = filePath;
    }
    get fStop() {
        return this.exif.exif.FNumber;
    }
    get exposureTime() {
        return this.exif.exif.ExposureTime;
    }
    get dateTaken() {
        return ExifHelper.dateParseHelper(this.exif.exif.DateTimeOriginal, this.exif.exif.SubSecTime * 10);
    }
    get dateTakenMs() {
        return this.dateTaken.getTime();
    }
    /**
     * Filename without path
     * */
    get fileName() {
        return path.basename(this.filePath);
    }
    get directoryName() {
        return path.dirname(this.filePath);
    }
    static dateParseHelper(exifDate, ms = 0) {
        const date = REGEX_MATCH_EXIF_DATE.exec(exifDate);
        if (date) {
            return new Date(date[1], date[2], date[3], date[4], date[5], date[6], ms);
        }
        else {
            throw new Error("Cannot parse date " + exifDate);
        }
    }
    static async Promise(filePath) {
        return new ExifHelper(await ExifPromise(filePath), filePath);
    }
}

export default ExifHelper;
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
        //this.exif = {
        //    exif: {
        //        fNumber: exif.exif.FNumber,
        //        ExposureTime: exif.exif.ExposureTime,
        //        DateTimeOriginal: exif.exif.DateTimeOriginal,
        //        SubSecTime: exif.exif.SubSecTime,
        //        Width: exif.image.XResolution,
        //        Height: exif.image.YResolution
        //    }
        //}
        this.filePath = filePath;
        //delete this.exif.gps;
        //delete this.exif.image;
        //delete this.exif.interoperability;
        //delete this.exif.thumbnail;
        delete this.exif.exif.MakerNote;
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
    //! Original pixel width
    get width() {
        return this.exif.exif.PixelXDimension;
    }
    //! Original pixel height
    get height() {
        return this.exif.exif.PixelYDimension;
    }
    //! Real pixel width with image orientation
    get rotatedWidth() {
        return this.isOnSide ? this.width : this.height;
    }
    //! Original pixel height
    get rotatedHeight() {
        return this.isOnSide ? this.height : this.width;
    }
    // Returns true if the image is rotated "on side" and X and Y are swapped
    get isOnSide() {
        const ori = this.exif.image.Orientation;
        return ori >= 5 && ori <= 8;
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
        const date = new Date(exifDate);
        date.setMilliseconds(ms);
        return date;
        //const date = REGEX_MATCH_EXIF_DATE.exec(exifDate);
        //if (date) {
        //    return new Date(date[1], date[2], date[3], date[4], date[5], date[6], ms);
        //}
        //else {
        //    throw new Error("Cannot parse date " + exifDate);
        //}
    }
    static async Promise(filePath) {
        return new ExifHelper(await ExifPromise(filePath), filePath);
    }
}

export default ExifHelper;
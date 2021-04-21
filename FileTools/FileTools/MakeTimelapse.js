import ExifPromise from "./ExifPromise.js";
import ExifHelper from "./ExifHelper.js";
import ExecPromise from "./fshelp/ExecPromise.js";
import PhotoSequence from "./PhotoSequence.js";
import MakeDirectory from "./fshelp/MakeDirectory.js";
import * as ExifValidators from "./ExifCompatibilityValidators.js";
import FileStat from "./fshelp/FileStat.js";
import MassPromiseHandler from "./MassPromiseHandler.js";
import * as path from "path";
import * as fs from "fs";
import ReadDirectory from "./fshelp/ReadDirectory.js";
console.log(process.argv[2].length);
const currentDir = process.argv[2].length > 0 ? path.resolve(process.argv[2]) : path.resolve(".");
const REGEX_VALID_PHOTO = /\\DSC_[0-9]{4}\.jpg$/i;


async function PhotoFilter(file) {

    if (REGEX_VALID_PHOTO.test(file)) {
        return true;
    }
    else {
        const stat = await FileStat(file);
        if (stat.isDirectory()) {
            return { include: false, browse: true };
        }
    }
    return false;
}

console.log("Scanning ", currentDir, " for photos");
(async () => {
    const files = await ReadDirectory(currentDir, { recursive: true, filter: PhotoFilter });//REGEX_VALID_PHOTO.test(fpath)
    console.log(files.length, " files found.");
    const exifPromises = files.map((fpath) => { return () => ExifHelper.Promise(fpath); });
    console.log("Reading Exif data.");
    const loadHelper = new MassPromiseHandler(exifPromises);

    let lastDone = 0;
    loadHelper.onPromisesDone = (results) => {
        //console.log(loadHelper.length, loadHelper.countDone, loadHelper.fractionDone);
        if (lastDone != Math.round(loadHelper.percentDone)) {
            lastDone = Math.round(loadHelper.percentDone);
            console.log("Reading exif: ", lastDone, "%");
        }
    };
    await loadHelper.all();
    const exifs = loadHelper.results;
    console.log("Sorting files by date taken.");
    exifs.sort((a, b) => a.dateTakenMs - b.dateTakenMs);

    let lastPerc = 0;
    const max = exifs.length;
    let cur = 0;

    const stream = fs.createWriteStream(path.join(currentDir, "files.txt"));
    for (const exif of exifs) {
        stream.write("file '" + exif.filePath + "'\n");
        // logging progress
        const perc = (cur * 100) / max;
        if (Math.round(perc/2) != Math.round(lastPerc/2)) {
            console.log("Writing file list ", Math.round(perc), "%");
            lastPerc = perc;
        }
        ++cur;
    }
    //ffmpeg -r 24 -i ../drevo_full.mp4 -vcodec libx264 -crf 30 -pix_fmt yuv420p -vf scale=900:468 ../drevo_small.mp4
    const args = [
        '-r',
        '24', '-f',
        'concat', '-safe', '0', '-i',
        'files.txt', '-vcodec',
        'libx264', '-crf',
        '30', '-pix_fmt',
        'yuv420p', '-vf',
        'scale=1124:750', 'timelapse.mp4'
    ];
    const result = await ExecPromise("ffmpeg", args, { cwd: currentDir, windowsHide: true, stdoutTarget: process.stdout });
    console.log('done');
})();
import ExifPromise from "./ExifPromise.js";
import ExifHelper from "./ExifHelper.js";
import PhotoSequence from "./PhotoSequence.js";
import MakeDirectory from "./fshelp/MakeDirectory.js";
import * as ExifValidators from "./ExifCompatibilityValidators.js";

import * as path from "path";
import ReadDirectory from "./fshelp/ReadDirectory.js";

const mainDir = process.argv[2];

console.log("Scanning ", mainDir, " for photos");



(async () => {
    const files = await ReadDirectory(mainDir, { recursive: false, filter: (fpath) => fpath.toLowerCase().endsWith(".jpg") });
    //console.log(JSON.stringify(await ExifPromise("C:\\Users\\jakub.mareda\\Pictures\\fotky\\DSC_5835.JPG")));
    //const info = await ExifPromise("C:\\Users\\jakub.mareda\\Pictures\\fotky\\DSC_5835.JPG");
    //console.log(files);

    const exifPromises = files.map((path) => ExifHelper.Promise(path));
    const exifs = (await Promise.all(exifPromises));
    exifs.sort((a, b) => a.dateTakenMs - b.dateTakenMs);

    /** @type {PhotoSequence[]} **/
    const foundSequences = [];
    const currentSequence = new PhotoSequence(new ExifValidators.TimedSequence(20));

    for (const exif of exifs) {
        if (!currentSequence.add(exif)) {
            if (currentSequence.length > 2) {
                foundSequences.push(currentSequence.move());
            }
            else {
                currentSequence.clear();
                // start from the item that failed the last sequence, otherwise it would get skipped
                currentSequence.add(exif);
            }
        }
    }
    let sequenceId = 1;
    for (const sequence of foundSequences) {
        console.log("Sequence: ");
        console.log([...sequence.itemNames]);
        const newDir = "Sequence_" + sequence.firstName + "_" + sequence.lastName;
        const newDirFull = path.join(mainDir, newDir);
        const projectFile = path.join(newDirFull, sequence.firstName + "-" + sequence.lastName + ".spj");
        console.log("Moving into:", newDirFull)
        await MakeDirectory(newDirFull, true);
        await sequence.moveFilesInto(newDirFull, true);
        //console.log("Project: ", sequence.createICEProject(projectFile));
        await sequence.writeICEProject(projectFile);
        console.log("\n");
    }

}) ();

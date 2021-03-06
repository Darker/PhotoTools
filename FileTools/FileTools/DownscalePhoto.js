import * as path from "path";
import * as fs from "fs";
import IrfanViewProcessor from "./imageProcessor/IrfanViewProcessor.js";
import ImageChangeOption from "./imageProcessor/ImageChangeOption.js";
import FileAccess from "./fshelp/FileAccess.js";
import ReadFile from "./fshelp/ReadFile.js";

const input = path.resolve(process.argv[2]);
const currentDir = path.dirname(input);

//const irfanDefault = "C:\\Program Files\\IrfanView\\i_view64.exe";
const scriptDir = path.dirname(import.meta.url).replace("file:///", "");
const irfanLocal = path.join(scriptDir, "../bin/i_view64.exe");
const scale = process.argv[3] ? 1 * process.argv[3] : 0.5;

(async () => {
    let irfanPath = irfanLocal;
    const irfanPathTxt = path.join(scriptDir, "irfanpath.txt");
    if (await FileAccess(irfanPathTxt, FileAccess.MODE.READ)) {
        let pathToIrfanDirty = (await ReadFile(irfanPathTxt)).toString();
        //console.log(pathToIrfanDirty);
        pathToIrfanDirty = pathToIrfanDirty.replace(/^\uFEFF/, '').replace(/(^\s+|^"|"$|"\s*\n|\s+$)/gs, "");
        //console.log("Cleaned path: ", pathToIrfanDirty, pathToIrfanDirty.charCodeAt(0), pathToIrfanDirty.charCodeAt(1));

        const data = path.resolve(pathToIrfanDirty);
        if (await FileAccess(data, FileAccess.MODE.READ)) {
            console.log("Set irfan view exe path to ", data);
            irfanPath = data;
        }
        else {
            console.error("Invalid path to irfan: ", data);
            process.exit(1);
        }
    }

    if (!await FileAccess(irfanPath, FileAccess.MODE.READ)) {
        console.error("Cannot find irfan view at " + irfanPath);
        console.error("Either place irfan view at the listed path, or you can set path to irfan view by placing the path to the exefile in " + irfanPathTxt);
        process.exit(1);
    }

    const proc = new IrfanViewProcessor(irfanPath, currentDir);
    proc.input = input;
    proc.output = input.replace(/(\.[a-z]+$)/i, "_small$1");
    proc.addAction(new ImageChangeOption.ResampleRelative(scale));
    try {
        await proc.process();
    }
    catch (error) {
        console.trace(error);
        console.log(error);
        console.dir(error);
        process.exit(2);
    }

})();

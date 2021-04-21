import IImageFileProcessor from "./IImageFileProcessor.js";
import ExifHelper from "../ExifHelper.js";
import ExecPromise from "../fshelp/ExecPromise.js";

import * as path from "path";
import ImageSize from "../fshelp/ImageSize.js";

class IrfanViewProcessor extends IImageFileProcessor {
    constructor(irfanExecutablePath, currentDir) {
        super();
        this.irfanPath = irfanExecutablePath;
        this.cwd = currentDir;
    }

    async process() {
        // Get exif info
        const exif = await ExifHelper.Promise(this.input);
        const dimensions = await ImageSize(this.input);
        let onSide = false;
        if (exif.isValid) {
            console.log("Image is" + (exif.isOnSide ? " " : " not ") + "rotated");
            onSide = exif.isOnSide;
            //if (dimensions.width != exif.rotatedWidth || dimensions.height != exif.rotatedHeight) {
            //    console.error(`Exif and real dimensions do not match\r\n  EXIF: ${exif.rotatedWidth}x${exif.rotatedHeight}\r\n  REAL: ${dimensions.width}x${dimensions.height}`);
            //    await new Promise((resolve) => setTimeout(resolve, 5000));
            //}
            console.log("ON SIDE:", onSide, exif.isOnSide);
        }

        console.log("ON SIDE:", onSide);

        //console.log(exif);
        // prepare options
        const commandLine = [this.input];
        for (const opt of this.actions) {
            switch (opt.name) {
                case "resample-relative": {
                    //const dims = [Math.round(exif.rotatedHeight * opt.args[0]), Math.round(exif.rotatedWidth * opt.args[0])];
                    const dims = [Math.round(dimensions.width * opt.args[0]), Math.round(dimensions.height * opt.args[0])];
                    // rotate dimensions if image is on side
                    console.log("ON SIDE:", onSide);
                    if (onSide) {
                        console.log(dims);
                        dims.reverse();
                        console.log(dims);
                    }

                    commandLine.push("/resize=(" + dims.join(",") + ")");
                    commandLine.push("/resample");
                }
            }
        }
        commandLine.push("/convert=\"" + this.output + "\"");
        const result = await ExecPromise(this.irfanPath, commandLine, { cwd: path.dirname(this.irfanPath), stdoutTarget: process.stdout, windowsVerbatimArguments: true });
        //console.log('done');
    }
}

export default IrfanViewProcessor;
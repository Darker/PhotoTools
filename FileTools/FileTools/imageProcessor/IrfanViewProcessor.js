import IImageFileProcessor from "./IImageFileProcessor.js";
import ExifHelper from "../ExifHelper.js";
import ExecPromise from "../fshelp/ExecPromise.js";

import * as path from "path";

class IrfanViewProcessor extends IImageFileProcessor {
    constructor(irfanExecutablePath, currentDir) {
        super();
        this.irfanPath = irfanExecutablePath;
        this.cwd = currentDir;
    }

    async process() {
        // Get exif info
        const exif = await ExifHelper.Promise(this.input);
        //console.log(exif);
        // prepare options
        const commandLine = [this.input];
        for (const opt of this.actions) {
            switch (opt.name) {
                case "resample-relative": {
                    const dims = [Math.round(exif.rotatedHeight * opt.args[0]), Math.round(exif.rotatedWidth * opt.args[0])];
                    
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
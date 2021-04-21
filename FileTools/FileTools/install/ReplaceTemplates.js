import * as path from "path";
import * as fs from "fs";

import FileAccess from "../fshelp/FileAccess.js";
import ReadFile from "../fshelp/ReadFile.js";
import WriteFile from "../fshelp/WriteFile.js";

//const irfanDefault = "C:\\Program Files\\IrfanView\\i_view64.exe";
const scriptDir = path.dirname(import.meta.url).replace("file:///", "");
const templateFile = path.join(scriptDir, "../batch/addToShell.reg.template")


const VARS = {
    PHOTO_TOOLS_HOME: path.join(scriptDir, ".."),
    PHOTO_TOOLS_HOME_WINDOWS_ESCAPED: null,
};
VARS.PHOTO_TOOLS_HOME_WINDOWS_ESCAPED = VARS.PHOTO_TOOLS_HOME.replace(/\//g, "\\").replace(/\\/g, "\\\\");

(async () => {
    if (await FileAccess(templateFile, FileAccess.MODE.WRITE)) {
        let data = (await ReadFile(templateFile)).toString();
        let replaced = false;
        data = data.replace(/\$\{([A-Z0-9_\.]+)\}/ig, (match, g1) => {
            replaced = true;
            if (VARS[g1]) {
                return VARS[g1];
            }
            else {
                return "";
            }
        });
        if (replaced) {
            await WriteFile(templateFile.replace(/\.template$/, ""), data);
        }
    }
    else {
        console.warn("Cannot find template!");
    }

})();
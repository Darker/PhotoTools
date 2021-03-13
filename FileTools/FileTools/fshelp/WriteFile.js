
import * as fs from "fs";

/**
 *
 * @param {import("fs").PathLike} path
 * @param {any} data
 * @param {import("fs").WriteFileOptions} options
 * @returns {Promise<void>}
 */
function WriteFile(path, data, options = {}) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(path, data, options, function (err) {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
}
export default WriteFile;
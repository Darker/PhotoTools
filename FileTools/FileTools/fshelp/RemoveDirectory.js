import * as fs from "fs";

/**
 *
 * @param {import("fs").PathLike} path
 * @param {import("fs").RmDirAsyncOptions} options
 * @returns {Promise<void>}
 */
function RemoveDirectory(path, options) {
    return new Promise(function (resolve, reject) {
        fs.rmdir(path, options, function (err) {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
}
export default RemoveDirectory;
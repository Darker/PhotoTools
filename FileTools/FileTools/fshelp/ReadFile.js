import * as fs from "fs";

/**
 *
 * @param {import("fs").PathLike} path
 * @param {{}} options
 * @returns {Promise<Buffer>}
 */
function ReadFile(path, options = {}) {
    return new Promise(function (resolve, reject) {
        fs.readFile(path, options, function (err, data) {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
}
export default ReadFile;
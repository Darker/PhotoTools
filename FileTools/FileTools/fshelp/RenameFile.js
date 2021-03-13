import * as fs from "fs";
/**
 *
 * @param {import("fs").PathLike} oldPath
 * @param {import("fs").PathLike} newPath
 * @returns {Promise<string>}
 */
function RenameFile(oldPath, newPath) {
    return new Promise(function (resolve, reject) {
        fs.rename(oldPath, newPath, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(newPath);
            }
        });
    });
}
export default RenameFile;
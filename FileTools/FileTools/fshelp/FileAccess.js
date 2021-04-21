import * as fs from "fs";
/**
 *
 * @param {string|Buffer|URL} name
 * @param {number} mode
 * @returns {Promise<boolean>}
 */
function FileAccess(name, mode = fs.constants.F_OK) {
    return new Promise(function (resolve, reject) {
        fs.access(name, mode, (err) => {
            resolve(!err);
        });
    });
}
FileAccess.MODE = {
    EXISTS: fs.constants.F_OK,
    READ: fs.constants.R_OK,
    WRITE: fs.constants.W_OK
}
export default FileAccess;
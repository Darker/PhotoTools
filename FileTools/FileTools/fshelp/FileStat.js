import * as fs from "fs";
/**
 *
 * @param {string} path
 * @returns {Promise<fs.Stats>}
 */
export default function FileStat(path) {
    return new Promise(function (resolve, reject) {
        fs.stat(path, function (err, res) {
            err ? reject(err) : resolve(res);
        });
    })
}
import * as fs from "fs";
import * as path from "path";
import FileStat from "./FileStat.js";

/**
 *
 * @param {string} directoryPath
 * @returns {Promise<string[]>}
 */
function ReadDirectoryPromise(directoryPath) {
    return new Promise(function (resolve, reject) {
        fs.readdir(directoryPath, function (err, res) {
            err ? reject(err) : resolve(res);
        });
    });
}

/**
 * @typedef {Object} ReadDirectoryOptions
 * @prop {function(string):Promise<boolean|{include:boolean,browse:boolean}>} filter filter for each result, note that excluding directory excludes it's content
 * @prop {boolean} directories if true, directories are included in result
 * @prop {boolean} recursive if true, scans subdirectories
 *
 */

/**
 *
 * @param {string} directoryPath
 * @param {ReadDirectoryOptions} options
 * @returns {Promise<string[]>}
 */
export default async function ReadDirectory(directoryPath, options = { files: true, directories:false, recursive: false }) {
    const files = (await ReadDirectoryPromise(directoryPath)).map((filename) => path.resolve(directoryPath, filename));


    let subresultsArray = null;

    const deleteLater = [];
    const doNotBrowse = [];

    if (typeof options.filter == "function") {
        for (let i = 0, l = files.length; i < l; ++i) {
            const f = files[i];
            let remove = false;

            const filterResult = await options.filter(f);
            if (typeof filterResult == "object") {
                // not included, check if delete now or later
                if (filterResult.include == false) {
                    if (filterResult.browse) {
                        deleteLater.push(f);
                    }
                    else {
                        remove = true;
                    }
                }
                // included but not browsed
                else if (filterResult.browse == false) {
                    doNotBrowse.push(f);
                }
            }
            else {
                remove = !filterResult;
            }

            if (remove) {
                files.splice(i, 1);
                --i;
                --l;
            }
        }
    }


    if (options.recursive) {
        subresultsArray = [];
        for (const file of files) {
            if (doNotBrowse.indexOf(file) == -1) {
                const stat = await FileStat(file);
                if (stat.isDirectory()) {
                    const subresults = await ReadDirectory(file, options);
                    subresultsArray.push(...subresults);
                }
            }
        }
    }

    for (const removedFile of deleteLater) {
        const index = files.indexOf(removedFile);
        files.splice(index, 1);
    }

    //if (!options.files) {
    //    for (let i = 0, l = files.length; i < l; ++i) {
    //        const f = files[i];
    //        let remove = false;
    //        if (directories) {
    //            if (directories.indexOf(f) != -1) {
    //                remove = true;
    //            }
    //        }
    //        else {
    //            const stat = await FileStat(f);
    //            if (stat.isDirectory()) {
    //                remove = true;
    //            }
    //        }

    //        if (remove) {
    //            files.splice(i, 1);
    //            --i;
    //            --l;
    //        }
    //    }
    //}

    if (subresultsArray) {
        files.push(...subresultsArray);
    }
    return files;
}


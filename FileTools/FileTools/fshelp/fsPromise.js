/**
* @template FNArg1
* @template FNArg2
* @template FNArg3
* @template FNCbArg
* @template FNReturn
* @param {function(FNArg1, FNArg2, FNArg3, function(any, FNCbArg):void)} fsFn
* @param {FNArg1} arg1
* @param {FNArg2} arg2
* @param {FNArg3} arg3
* @returns {Promise<FNCbArg>}
*/
function fsPromise(fsFn, arg1, arg2, arg3, arg4) {
    return new Promise(function (resolve, reject) {
        fsFn(...([arg1, arg2, arg3, arg4].filter(x => typeof x != "undefined")), function (error, result) {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
}
/**
 * @template FNArg1
 * @template FNCbArg
 * @template FNReturn
 * @param {function(FNArg1, function(any, FNCbArg):void)} fsFn
 * @param {FNArg1} arg1
 * @returns {Promise<FNCbArg>}
 */
function fsPromise1Arg(fsFn, arg1) {
    return fsPromise(fsFn, arg1);
}
/**
* @template FNArg1
* @template FNArg2
* @template FNCbArg
* @template FNReturn
* @param {function(FNArg1, FNArg2, function(any, FNCbArg):void)} fsFn
* @param {FNArg1} arg1
* @param {FNArg2} arg2
* @returns {Promise<FNCbArg>}
*/
function fsPromise2Arg(fsFn, arg1, arg2) {
    return fsPromise(fsFn, arg1, arg2);
}
fsPromise.arg1 = fsPromise1Arg;
fsPromise.arg2 = fsPromise2Arg;

export default fsPromise;
import image_size from "image-size";

/**
 * @typedef {Object} Dimensions - image dimension info
 * @property {number} width
 * @property {number} height
 */

/**
 * 
 * @param {string} path
 * @returns {Promise<Dimensions>}
 */
function ImageSize(path) {
    return new Promise(function (resolve, reject) {
        image_size(path, (err, result)=>{
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
}

export default ImageSize;

import * as ExifCompatibilityValidators from "./ExifCompatibilityValidators.js";
import RenameFile from "./fshelp/RenameFile.js";
import WriteFile from "./fshelp/WriteFile.js";
import * as path from "path";
import { write } from "fs";
/**
 * @typedef {import("./ExifPromise").ExifInfo} ExifInfo
 * */

/**
 * @typedef {import("./ExifHelper").default} ExifHelper
 * */

class PhotoSequence {
    /**
     *
     * @param {ExifCompatibilityValidators.ExifCompatibilityValidator} validator
     */
    constructor(validator = ExifCompatibilityValidators.Always.False) {
        /** @type {ExifHelper[]} **/
        this.items = [];

        this.validator = validator;
    }
    get first() {
        if (!this.empty)
            return this.items[0];
        else
            return null;
    }
    get last() {
        if (!this.empty)
            return this.items[this.items.length - 1];
        else
            return null;
    }
    get firstName() {
        if (!this.empty) {
            return path.parse(this.first.filePath).name;
        }
        else {
            throw new Error("Cannot get first name in empty sequence!");
        }
    }
    get lastName() {
        if (!this.empty) {
            return path.parse(this.last.filePath).name;
        }
        else {
            throw new Error("Cannot get last name in empty sequence!");
        }
    }
    get empty() {
        return this.items.length == 0;
    }
    get length() {
        return this.items.length;
    }
    get itemNames() {
        return this.itemNamesGenerator();
    }
    *itemNamesGenerator() {
        for (const item of this.items) {
            yield item.fileName;
        }
    }
    clear() {
        this.items.length = 0;
    }
    /**
     *
     * @param {import("fs").PathLike} newDirectory
     * @param {boolean} renameItems If true, the exif items will have their names changed
     */
    async moveFilesInto(newDirectory, renameItems = false) {
        /**
         *
         * @param {ExifHelper} item
         */
        async function RenameExifItem(item) {
            const newName = path.join(newDirectory, item.fileName);
            await RenameFile(item.filePath, newName);
            if (renameItems) {
                item.filePath = newName;
            }
        }
        const renamePromises = this.items.map((x) => RenameExifItem(x));
        await Promise.all(renamePromises);
    }
    /**
     * Creates spj project for ICE in given path
     * */
    async writeICEProject(filename) {
        return await WriteFile(filename, this.createICEProject(filename));
    }
    /**
     *
     * @param {string} filename file in which the project will be saved, if you want relative paths in XML
     */
    createICEProject(filename) {
        const xmlBegin = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n"
            + "  <stitchProject version=\"2.0\" cameraMotion=\"automatic\">\n"
            + "    <sourceImages>\n";
        const xmlEnd = "  </sourceImages>\n</stitchProject>";
        const imageTemplate = path => `      <sourceImage filePath="${path}" />\n`;
        const projectDir = typeof filename == "string" ? path.dirname(filename) : null;
        const getImagePath = imageExif => {
            if (typeof projectDir == "string") {
                return path.relative(projectDir, imageExif.filePath);
            }
            return imageExif.filePath;
        };
        return xmlBegin +
            this.items.map(x=>imageTemplate(getImagePath(x))).join("") +
            xmlEnd;
    }
    /**
     * Add item to sequence, returns false if the item is not compatible with previous items
     * @param {ExifHelper} item
     */
    add(item) {
        if (!this.empty) {
            if (!this.validator.areCompatible(item, this.last)) {
                return false;
            }
        }
        // if all above checks passed
        this.items.push(item);
        return true;
    }

    /**
     * Clone this sequence, the array inside is copied, the validator is shared
     * @returns {PhotoSequence}
     * */
    clone() {
        const newItems = [...this.items];
        const clone = new PhotoSequence(this.validator);
        clone.items = newItems;
        return clone;
    }
    /**
     * Move this sequences photose into new sequence
     * */
    move() {
        const clone = new PhotoSequence(this.validator);
        clone.items = this.items;
        this.items = [];
        return clone;
    }
}

export default PhotoSequence;
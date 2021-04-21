import ImageChangeOption from "./ImageChangeOption.js";

class IImageFileProcessor {
    constructor() {
        // Path to the input file
        this.input = "";
        // where to create the output file
        this.output = "";
        // Options for processing
        /** @type {ImageChangeOption[]} **/
        this.actions = [];
    }

    // Process the image or reject with an error
    async process() { }
    /**
     * add action
     * @param {ImageChangeOption} changeAction
     */
    addAction(changeAction) {
        this.actions.push(changeAction);
    }
}

export default IImageFileProcessor;
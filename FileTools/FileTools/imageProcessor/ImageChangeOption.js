class ImageChangeOption {
    constructor(name, ...args) {
        this.name = name;
        this.args = args;
    }
}

class ResampleAbsolute extends ImageChangeOption {
    constructor(targetWidth, targetHeight) {
        super("resample-absolute", targetWidth, targetHeight);
    }
    get width() { return this.args[0]; }
    get height() { return this.args[1]; }
}
class ResampleRelative extends ImageChangeOption {
    constructor(ratio) {
        super("resample-relative", ratio);
    }

    get ratio() { return this.args[0]; }
}
ImageChangeOption.ResampleAbsolute = ResampleAbsolute;
ImageChangeOption.ResampleRelative = ResampleRelative;

export default ImageChangeOption;
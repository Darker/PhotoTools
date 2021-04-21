# FileTools

Tools for generating timelapse videos and rescaling photos automatically.

## Installing

 - Install [Node.js](https://nodejs.org/en/download/)
 - Clone or download this repository
 - Open command line, navigate to `FileTools/FileTools`
 - run `npm install`

## Rescaling photos

Currently, IrfanView rescaling is implemented. To downscale a photo using irfan view run:

```
node --experimental-modules FileTools/FileTools/DownscalePhoto.js [FILENAME] [SCALE:0-1]
```

Alternatively, you can use registry file from the `FileTools/FileTools/batch` to associate common image file types with the script. This will add a shell menu item to downscale a photo by half, it was tested on win10 only.
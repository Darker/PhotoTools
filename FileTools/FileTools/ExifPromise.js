import ExifImage from "exif";

/**
 * @typedef {Object} ExifInfo
 * @property {Object} image
 * @property {string} image.Make
 * @property {string} image.Model
 * @property {number} image.Orientation
 * @property {number} image.XResolution
 * @property {number} image.YResolution
 * @property {number} image.ResolutionUnit
 * @property {string} image.Software
 * @property {string} image.ModifyDate
 * @property {number} image.YCbCrPositioning
 * @property {number} image.ExifOffset
 * @property {Object} thumbnail
 * @property {number} thumbnail.Compression
 * @property {number} thumbnail.XResolution
 * @property {number} thumbnail.YResolution
 * @property {number} thumbnail.ResolutionUnit
 * @property {number} thumbnail.ThumbnailOffset
 * @property {number} thumbnail.ThumbnailLength
 * @property {number} thumbnail.YCbCrPositioning
 * @property {Object} exif
 * @property {number} exif.ExposureTime
 * @property {number} exif.FNumber
 * @property {number} exif.ExposureProgram
 * @property {Object} exif.ExifVersion
 * @property {string} exif.ExifVersion.type
 * @property {Buffer} exif.ExifVersion.data
 * @property {string} exif.DateTimeOriginal
 * @property {string} exif.CreateDate
 * @property {Object} exif.ComponentsConfiguration
 * @property {string} exif.ComponentsConfiguration.type
 * @property {Buffer} exif.ComponentsConfiguration.data
 * @property {number} exif.CompressedBitsPerPixel
 * @property {number} exif.ExposureCompensation
 * @property {number} exif.MaxApertureValue
 * @property {number} exif.MeteringMode
 * @property {number} exif.LightSource
 * @property {number} exif.Flash
 * @property {number} exif.FocalLength
 * @property {Object} exif.MakerNote
 * @property {string} exif.MakerNote.type
 * @property {Buffer} exif.MakerNote.data
 * @property {Object} exif.UserComment
 * @property {string} exif.UserComment.type
 * @property {Buffer} exif.UserComment.data
 * @property {string} exif.SubSecTime
 * @property {string} exif.SubSecTimeOriginal
 * @property {string} exif.SubSecTimeDigitized
 * @property {Object} exif.FlashpixVersion
 * @property {string} exif.FlashpixVersion.type
 * @property {Buffer} exif.FlashpixVersion.data
 * @property {number} exif.ColorSpace
 * @property {number} exif.ExifImageWidth
 * @property {number} exif.ExifImageHeight
 * @property {number} exif.InteropOffset
 * @property {number} exif.SensingMethod
 * @property {Object} exif.FileSource
 * @property {string} exif.FileSource.type
 * @property {Buffer} exif.FileSource.data
 * @property {Object} exif.SceneType
 * @property {string} exif.SceneType.type
 * @property {Buffer} exif.SceneType.data
 * @property {Object} exif.CFAPattern
 * @property {string} exif.CFAPattern.type
 * @property {Buffer} exif.CFAPattern.data
 * @property {number} exif.CustomRendered
 * @property {number} exif.ExposureMode
 * @property {number} exif.WhiteBalance
 * @property {number} exif.DigitalZoomRatio
 * @property {number} exif.FocalLengthIn35mmFormat
 * @property {number} exif.SceneCaptureType
 * @property {number} exif.GainControl
 * @property {number} exif.Contrast
 * @property {number} exif.Saturation
 * @property {number} exif.Sharpness
 * @property {number} exif.SubjectDistanceRange
 * @property {Object} gps
 * @property {Object} interoperability
 * @property {string} interoperability.InteropIndex
 * @property {Object} interoperability.InteropVersion
 * @property {string} interoperability.InteropVersion.type
 * @property {Buffer} interoperability.InteropVersion.data
 * @property {Object} makernote
 * @property {string} makernote.error
 */

// example exif
//(node:20380) ExperimentalWarning: The ESM module loader is experimental.
//{
//  image: {
//    Make: 'NIKON CORPORATION',
//    Model: 'NIKON D50',
//    Orientation: 1,
//    XResolution: 300,
//    YResolution: 300,
//    ResolutionUnit: 2,
//    Software: 'Ver.1.00 ',
//    ModifyDate: '2019:11:09 14:17:52',
//    YCbCrPositioning: 2,
//    ExifOffset: 216
//  },
//  thumbnail: {
//    Compression: 6,
//    XResolution: 300,
//    YResolution: 300,
//    ResolutionUnit: 2,
//    ThumbnailOffset: 29468,
//    ThumbnailLength: 8405,
//    YCbCrPositioning: 2
//  },
//  exif: {
//    ExposureTime: 0.06666666666666667,
//    FNumber: 1.8,
//    ExposureProgram: 3,
//    ExifVersion: <Buffer 30 32 32 31>,
//    DateTimeOriginal: '2019:11:09 14:17:52',
//    CreateDate: '2019:11:09 14:17:52',
//    ComponentsConfiguration: <Buffer 01 02 03 00>,
//    CompressedBitsPerPixel: 4,
//    ExposureCompensation: -0.3333333333333333,
//    MaxApertureValue: 1.6,
//    MeteringMode: 2,
//    LightSource: 10,
//    Flash: 0,
//    FocalLength: 35,
//    MakerNote: <Buffer 4e 69 6b 6f 6e 00 02 10 00 00 4d 4d 00 2a 00 00 00 08 00 2b 00 01 00 07 00 00 00 04 30 32 31 30 00 02 00 03 00 00 00 02 00 00 01 90 00 04 00 02 00 00 ... 28438 more bytes>,
//    UserComment: <Buffer 41 53 43 49 49 00 00 00 28 43 29 20 4a 61 6b 75 62 20 4d 61 72 65 64 61 20 32 30 31 38 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20>,
//    SubSecTime: '30',
//    SubSecTimeOriginal: '30',
//    SubSecTimeDigitized: '30',
//    FlashpixVersion: <Buffer 30 31 30 30>,
//    ColorSpace: 1,
//    ExifImageWidth: 3008,
//    ExifImageHeight: 2000,
//    InteropOffset: 29328,
//    SensingMethod: 2,
//    FileSource: <Buffer 03>,
//    SceneType: <Buffer 01>,
//    CFAPattern: <Buffer 00 02 00 02 02 01 01 00>,
//    CustomRendered: 0,
//    ExposureMode: 0,
//    WhiteBalance: 1,
//    DigitalZoomRatio: 1,
//    FocalLengthIn35mmFormat: 52,
//    SceneCaptureType: 0,
//    GainControl: 0,
//    Contrast: 0,
//    Saturation: 0,
//    Sharpness: 0,
//    SubjectDistanceRange: 0
//  },
//  gps: {},
//  interoperability: { InteropIndex: 'R98', InteropVersion: <Buffer 30 31 30 30> },
//  makernote: {
//    error: 'Unable to extract Makernote information as it is in an unsupported or unrecognized format.'
//  }
//}


/**
 * @param {import("fs").PathLike} path
 * @returns {Promise<ExifInfo>}
 */
function ExifPromise(path) {
    return new Promise(function (resolve, reject) {
        try {
            new ExifImage({ image: path }, function (error, exifData) {
                if (error)
                    reject(error);
                else
                    resolve(exifData);
            });
        } catch (error) {
            reject(error);
        }
    });
}

export default ExifPromise;
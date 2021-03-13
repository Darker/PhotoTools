import * as fs from "fs";

function MakeDirectory(name, recursive = true) {
    return new Promise(function (resolve, reject) {
        fs.mkdir(name, { recursive: true }, (err) => {
            if (err) reject(err); else resolve(name);
        });
    });
}

export default MakeDirectory;
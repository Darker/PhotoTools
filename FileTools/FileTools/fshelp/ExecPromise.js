import * as child_process from "child_process";

function ExecPromise(path, args, options) {
    return new Promise(function (resolve, reject) {
        //console.log("EXEC: ", path, args, options);
        const chprocess = child_process.execFile(path, args, options, (err) => { if (err) reject(err); else resolve(); });
        if (options.stdoutTarget) {
            //options.stdoutTarget.pipe(process.stdout
            //console.log(options.stdoutTarget, options.stdoutTarget == process.stdout);
            chprocess.stdout.pipe(options.stdoutTarget, { end: false });
        }
    });
}

export default ExecPromise;
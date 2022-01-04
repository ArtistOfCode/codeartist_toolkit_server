const { exec, spawn } = require('child_process');
var iconv = require('iconv-lite');

const decode = (res, encoding) => iconv.decode(Buffer.from(res, "binary"), encoding || 'GBK');

const CMD = {
    exec: (command) => {
        return new Promise((resolve, reject) => {
            exec(command, { encoding: "binary" }, (error, stdout, stderr) => {
                if (error || stderr) {
                    reject(error || stderr)
                    return;
                };
                resolve(decode(stdout));
            })
        })
    },
    execStream: (command) => {
        return new Promise((resolve, reject) => {
            const { stdout } = exec(command, { encoding: "utf8" });
            stdout.on('data', (data) => resolve(data))
        })
    }
}

module.exports = CMD;
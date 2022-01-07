import { exec } from 'child_process';
var iconv = require('iconv-lite');

const decode = (res: string, encoding?: string) => iconv.decode(Buffer.from(res, "binary"), encoding || 'GBK');

const CMD = {
    exec: (command) => {
        console.debug('CMD:', command)
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
    execStream: (command, cb, end, encoding?) => {
        const { stdout } = exec(command, { encoding: "binary" });
        stdout.on('data', (data) => cb(decode(data, encoding)))
        stdout.on('end', end)
        stdout.on('error', end)
    }
}

export default CMD;
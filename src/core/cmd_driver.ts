import { exec } from 'child_process';
var iconv = require('iconv-lite');

function decode(res: string, encoding?: string): string {
    return iconv.decode(Buffer.from(res, "binary"), encoding || 'GBK');
}

class CMD {

    public static exec(command: string): Promise<string> {
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
    }
    public static execStream(command: string, cb: (result: string) => void, end: (result: string) => void, encoding?: string) {
        const { stdout } = exec(command, { encoding: "binary" });
        stdout.on('data', (data) => cb(decode(data, encoding)))
        stdout.on('end', end)
        stdout.on('error', end)
    }
}

export default CMD;
import * as path from 'path';
const CMD = require('./cmd_driver');

const app = {
    pdf: 'lib/pdf/pdftk.exe'
}

const execute = (exe, args) => CMD.exec(path.join(process.cwd(), exe) + (args ? (' ' + args) : ''))

class EXE {
    static pdf(args) {
        return execute(app.pdf, args)
    }
}

export default EXE;
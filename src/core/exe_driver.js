const path = require('path');
const CMD = require('./cmd_driver');

const app = {
    pdf: 'lib/pdf/pdftk.exe'
}

const execute = (exe, args) => CMD.exec(path.join(process.cwd(), exe) + (args ? (' ' + args) : ''))

const EXE = {
    pdf: (args) => execute(app.pdf, args),
}

module.exports = EXE;
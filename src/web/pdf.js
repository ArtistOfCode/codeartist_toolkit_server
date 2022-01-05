const express = require('express');
const multer = require('multer')
const EXE = require('../core/exe_driver');
const path = require('path');
const response = require('./response');
const Parser = require('../util/Parser');

const dest = path.join(process.cwd(), '/tmp');
const router = express.Router();
const upload = multer({ dest })

router.post('/', upload.single('file'), (req, res) => {
    if (!req.file) {
        res.json(response.badRequest('文件不能为空'))
        return;
    }
    const { filename, size } = req.file;
    const pdf = path.join(dest, filename)

    EXE.pdf(`${pdf} dump_data`)
        .then(data => {
            const result = Parser.ini(data, ': ')
            res.json(response.ok({ filename, size, pdf: result }))
        })
        .catch(err => res.json(response.error(err)))
})

router.post('/merge', (req, res) => {
    const { filename, pdfs } = req.body;
    if (!pdfs || pdfs.length < 2) {
        res.json(response.badRequest('文件数量异常'));
    }

    const args = pdfs.map(pdf => path.join(dest, pdf)).join(' ')
    const mergeFilename = path.join(dest, (filename || Date.now()) + '.pdf')

    EXE.pdf(`${args} output ${mergeFilename}`)
        .then(data => {
            res.download(mergeFilename);
            // res.end(() => {
            //     // if (fs.existsSync(dest)) {
            //     //     delDir(dest)
            //     // }
            // })
        })
        .catch(err => res.json(response.error('PDF合并异常', err)))
})

module.exports = router;
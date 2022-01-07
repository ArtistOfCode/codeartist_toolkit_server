import { Router } from 'express';
import * as multer from 'multer';
import EXE from '../core/exe_driver';
import { join } from 'path';
import Response from './response';
import Parser from '../util/Parser';

const dest = join(process.cwd(), '/tmp');
const router = Router();
const upload = multer({ dest });

router.post('/', upload.single('file'), (req, res) => {
    if (!req.file) {
        res.json(Response.badRequest('文件不能为空'))
        return;
    }
    const { filename, size } = req.file;
    const pdf = join(dest, filename)

    EXE.pdf(`${pdf} dump_data`)
        .then(data => {
            const result = Parser.ini(data, ': ')
            res.json(Response.ok({ filename, size, pdf: result }))
        })
        .catch(err => res.json(Response.error(err)))
})

router.post('/merge', (req, res) => {
    const { filename, pdfs } = req.body;
    if (!pdfs || pdfs.length < 2) {
        res.json(Response.badRequest('文件数量异常'));
    }

    const args = pdfs.map(pdf => join(dest, pdf)).join(' ')
    const mergeFilename = join(dest, (filename || Date.now()) + '.pdf')

    EXE.pdf(`${args} output ${mergeFilename}`)
        .then(data => {
            res.download(mergeFilename);
            // res.end(() => {
            //     // if (fs.existsSync(dest)) {
            //     //     delDir(dest)
            //     // }
            // })
        })
        .catch(err => res.json(Response.error('PDF合并异常', err)))
})

export default router;
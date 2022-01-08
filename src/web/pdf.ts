import { Router } from 'express';
import * as multer from 'multer';
import * as path from 'path';
import ErrorRsp, { HttpStatus } from './error_resp';
import Parser from '../util/Parser';
import EXE from '../core/exe_driver';

const dest = path.join(process.cwd(), '/tmp');
const router = Router();
const upload = multer({ dest });

router.post('/', upload.single('file'), (req, res) => {
    if (!req.file) {
        res.status(HttpStatus.BAD_REQUEST).json(ErrorRsp.of('文件不能为空'))
        return;
    }
    const { filename, size } = req.file;
    const pdf = path.join(dest, filename)

    EXE.pdf(`${pdf} dump_data`)
        .then(data => {
            const result = Parser.ini(data, ': ')
            res.json({ filename, size, pdf: result })
        })
        .catch(err => res.json(ErrorRsp.of(err)))
})

router.post('/merge', (req, res) => {
    const { filename, pdfs } = req.body;
    if (!pdfs || pdfs.length < 2) {
        res.status(HttpStatus.BAD_REQUEST).json(ErrorRsp.of('文件数量异常'));
    }

    const args = pdfs.map((pdf: string) => path.join(dest, pdf)).join(' ')
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
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(ErrorRsp.of('PDF合并异常', err)))
})

export default router;
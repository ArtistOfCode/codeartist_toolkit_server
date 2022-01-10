import { Router } from 'express';
import * as multer from 'multer';
import * as path from 'path';
import EXE from '../core/exe_driver';
import Parser from '../util/Parser';
import ErrorRsp, { HttpStatus } from './error_resp';

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
    if (!pdfs || pdfs.length < 1) {
        res.status(HttpStatus.BAD_REQUEST).json(ErrorRsp.of('文件数量异常'));
    }

    let file = '', pageArgs = '';
    (pdfs as { page: string, name: string }[])
        .forEach((pdf, i) => {
            const label = String.fromCharCode(65 + i);
            file += `${label}=${path.join(dest, pdf.name)} `;
            pageArgs += `${label}${pdf.page} `;
        });

    const tmp: string = (filename || Date.now()) + '.pdf'
    const mergeFilename = path.join(dest, tmp)

    EXE.pdf(`${file}cat ${pageArgs}output ${mergeFilename}`)
        .then(() => { res.json({ pdf: tmp }); })
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(ErrorRsp.of('PDF合并异常', err)))
})

export default router;
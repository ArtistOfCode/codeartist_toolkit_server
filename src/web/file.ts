import { Router } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import ErrorRsp, { HttpStatus } from './error_resp';

const dest = path.join(process.cwd(), '/tmp');
const router = Router();

router.get('/:filename', (req, res) => {
    res.download(path.join(dest, req.params.filename))
})

router.delete('/', (req, res) => {
    const files: string[] = req.body.files;
    if (!files || files.length < 1) {
        res.status(HttpStatus.BAD_REQUEST)
            .json(ErrorRsp.of('文件不能为空'));
        return;
    }
    files.forEach(file => {
        const filePath = path.join(dest, file);
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .json(ErrorRsp.of('文件删除异常', err));
                    return;
                }
                console.log('删除文件:', filePath);
            })
        }
    });
    res.sendStatus(HttpStatus.OK);
})

export default router;
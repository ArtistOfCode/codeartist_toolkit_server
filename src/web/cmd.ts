import * as express from 'express';
import CMD from '../core/cmd_driver';
import EXE from '../core/exe_driver';
import Response from './response';

const router = express.Router();

router.get('/', (req, res) => {
    const { cmd } = req.query;
    if (!cmd) {
        res.json(Response.badRequest('命令不能为空'));
        return;
    }
    CMD.exec(<string>cmd)
        .then(stdout => res.json(Response.ok(stdout)))
        .catch(err => res.json(Response.error('命令执行失败', err)))
})

router.post('/exe', (req, res) => {
    const { exe, args } = req.body;
    if (!exe) {
        res.json(Response.badRequest('程序不能为空'));
        return;
    }

    EXE[exe](args)
        .then(stdout => res.json(Response.ok(stdout)))
        .catch(err => res.json(Response.error('命令执行失败', err)))
})

router.get('/stream', (req, res) => {
    const { cmd } = req.query;
    if (!cmd) {
        res.json(Response.badRequest('命令不能为空'));
        return;
    }

    res.header({
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
    });

    res.write(': ping\n\n')
    CMD.execStream(<string>cmd, data => {
        res.write('data: ' + data + '\n')
        res.write('\n\n')
    }, () => {
        res.write('event: close\n')
        res.write('\n\n')
        res.end()
    })
})

export default router;
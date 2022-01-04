const express = require('express');
const CMD = require('../core/cmd_driver');
const response = require('./response');

const router = express.Router();

router.get('/', (req, res) => {
    const { cmd } = req.query;
    if (!cmd) {
        res.json(response.badRequest('命令不能为空'));
        return;
    }
    CMD.exec(cmd)
        .then(stdout => res.json(response.ok(stdout)))
        .catch(err => res.json(response.error('命令执行失败', err)))
})

router.get('/stream', (req, res) => {
    const { cmd } = req.query;
    if (!cmd) {
        res.json(response.badRequest('命令不能为空'));
        return;
    }

    res.header({
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
    });

    res.write(': ping\n\n')
    CMD.execStream(cmd, data => {
        console.log(data)
        res.write('data: ' + data + '\n')
        res.write('\n\n')
    }, () => {
        res.write('event: close\n')
        res.write('\n\n')
        res.end()
    })
})

module.exports = router;
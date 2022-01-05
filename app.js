const express = require('express');
const expressWs = require('express-ws');
const cmd = require('./src/web/cmd');
const mysql = require('./src/web/mysql');
const pdf = require('./src/web/pdf');

const app = express();
expressWs(app);

// RequestBody
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    console.debug('url:', req.method, req.url)
    next();
});

// WebSocket
app.ws('/ws', (ws, req) => {

    ws.send('AiJiangnan');

    ws.on('message', (msg) => {
        console.log(msg);
    });
    console.log('socket', req.testing);
});

// API module
app.use('/client', mysql);
app.use('/cmd', cmd);
app.use('/pdf', pdf);

// Error handler
app.use((err, req, res, next) => {
    console.error('global error handler:', err.stack);
    res.json({ status: -1, msg: err.message });
})

app.listen(8888, () => console.log('码匠工具集服务端启动成功！\nURL: http://localhost:8888'));
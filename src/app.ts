import * as express from 'express';
import * as expressWs from 'express-ws';
import cmd from './web/cmd';
import ErrorRsp, { HttpStatus } from './web/error_resp';
import router from './web/mysql';
import pdf from './web/pdf';

const appBase = express();
const { app } = expressWs(appBase);

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
});

// API module
app.use('/client', router);
app.use('/cmd', cmd);
app.use('/pdf', pdf);

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
    console.error('global error handler:', err.stack);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorRsp.of(err.message, err));
})

app.listen(8888, () => console.log('码匠工具集服务端启动成功！\nURL: http://localhost:8888'));
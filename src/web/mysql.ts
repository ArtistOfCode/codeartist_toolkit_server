import * as express from 'express';
import MySQL from '../core/mysql_driver';
import ErrorRsp, { HttpStatus } from './error_resp';

const router = express.Router();

let mysql: MySQL = null;

router.post('/mysql/query', (req, res, next) => {
    mysql.query(req.body.sql as string)
        .then(result => res.json(result))
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(ErrorRsp.of('查询异常', err)));
});

router.post('/mysql', (req, res, next) => {
    mysql = new MySQL();
    mysql.connection(req.body)
        .then(() => res.sendStatus(HttpStatus.OK))
        .catch(next);
});

router.delete('/mysql', (req, res, next) => {
    mysql.end()
        .then(() => res.sendStatus(HttpStatus.OK))
        .catch(next);
});

export default router;
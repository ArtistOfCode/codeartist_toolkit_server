import * as express from 'express';
import MySQL from '../core/mysql_driver';
import Response from './response';

const router = express.Router();

let mysql: MySQL = null;

router.post('/mysql/query', (req, res, next) => {
    mysql.query(req.body.sql as string)
        .then(result => res.json(Response.ok(result)))
        .catch(err => res.json(Response.error('查询异常', err)));
});

router.post('/mysql', (req, res, next) => {
    mysql = new MySQL();
    mysql.connection(req.body)
        .then(() => res.json(Response.ok()))
        .catch(next);
});

router.delete('/mysql', (req, res, next) => {
    mysql.end()
        .then(() => res.json(Response.ok()))
        .catch(next);
});

export default router;
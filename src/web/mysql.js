const express = require('express');
const MySQL = require('../core/mysql_driver');
const response = require('./response');

const mysql = express.Router();

mysql.post('/mysql/query', (req, res, next) => {
    MySQL.query(req.body.sql)
        .then(result => res.json(response.ok(result)))
        .catch(err => res.json(response.error('查询异常', err)));
});

mysql.post('/mysql', (req, res, next) => {
    MySQL.connection(req.body)
        .then(() => res.json(response.ok()))
        .catch(next);
});

mysql.delete('/mysql', (req, res, next) => {
    MySQL.end()
        .then(() => res.json(response.ok()))
        .catch(next);
});

module.exports = mysql;
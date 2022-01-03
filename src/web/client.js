const express = require('express');
const MySQL = require('../core/mysql');

const client = express.Router();

client.post('/mysql/query', (req, res, next) => {
    MySQL.query(req.body.sql)
        .then(result => {
            res.json({ status: 0, msg: 'OK', data: result })
        })
        .catch(next);
});

client.post('/mysql', (req, res, next) => {
    MySQL.connection(req.body)
        .then(() => res.json({ status: 0, msg: 'OK' }))
        .catch(next);
});

client.delete('/mysql', (req, res, next) => {
    MySQL.end()
        .then(() => res.json({ status: 0, msg: 'OK' }))
        .catch(next);
});

module.exports = client;
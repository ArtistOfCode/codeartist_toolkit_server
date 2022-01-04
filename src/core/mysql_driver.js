const mysql = require('mysql');

const MySQL = {
    client: null,
    connection: (datasource) => {
        return new Promise((reslove, reject) => {
            const conn = mysql.createConnection(datasource);
            conn.connect();
            conn.query('SELECT 1', (error, results, fields) => {
                if (error) {
                    reject(error);
                    return;
                };
                this.client = conn;
                reslove();
            });
        })
    },
    end: async () => {
        if (this.client) await this.client.end();
    },
    query: (sql) => {
        return new Promise((reslove, reject) => {
            if (!this.client) {
                reject(new Error('数据库连接为空'));
                return;
            }
            this.client.query(sql, (error, results, fields) => {
                if (error) {
                    reject(error);
                    return;
                };
                reslove({ fields, data: results });
            });
        })
    }
}

module.exports = MySQL;
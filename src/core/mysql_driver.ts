import * as mysql from 'mysql';
import { Connection, ConnectionConfig } from 'mysql';

class MySQL implements ClientDriver<ConnectionConfig> {

    private client: Connection = null;


    public get getClient(): Connection {
        return this.client;
    }

    public connection(datasource: ConnectionConfig): Promise<string> {
        return new Promise((reslove, reject) => {
            const conn = mysql.createConnection(datasource);
            conn.connect();
            conn.query('SELECT 1', (error, results, fields) => {
                if (error) {
                    reject(error);
                    return;
                };
                this.client = conn;
                reslove(null);
            });
        })
    }

    public end(): Promise<string> {
        if (this.client) {
            return new Promise((resolve, reject) => {
                this.client.end(err => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(null);
                });
            });
        };
    }

    public query(sql: string): Promise<any> {
        console.debug('SQL:', sql)
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

export default MySQL;
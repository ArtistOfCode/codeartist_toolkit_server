import * as express from 'express';
import MySQL from '../core/mysql_driver';
import ErrorRsp, { HttpStatus } from './error_resp';

const router = express.Router();

enum Client {
    MYSQL = 'mysql',
    REDIS = 'redis',
}

class ClientPool {
    private static mysql: ClientDriver<any> = null;
    private static redis: ClientDriver<any> = null;

    public static getClient(type: Client): ClientDriver<any> {
        return this[type];
    }

    public static setClient(type: Client, client: ClientDriver<any>): void {
        this[type] = client;
    }
}

router.post('/:client/query', (req, res, next) => {
    ClientPool.getClient(req.params.client as Client)
        .query(req.body.sql as string)
        .then((result: any) => res.json(result))
        .catch((err: any) => res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(ErrorRsp.of('查询异常', err)));
});

router.post('/:client', (req, res, next) => {
    const { client } = req.params;
    let clientInstance: ClientDriver<any> = null
    if (client === Client.MYSQL) {
        clientInstance = new MySQL();
    }
    ClientPool.setClient(client as Client, clientInstance);
    ClientPool.getClient(client as Client)
        .connection(req.body)
        .then(() => res.sendStatus(HttpStatus.OK))
        .catch(next);
});

router.delete('/:client', (req, res, next) => {
    ClientPool.getClient(req.params.client as Client)
        .end()
        .then(() => ClientPool.setClient(req.params.client as Client, null))
        .then(() => res.sendStatus(HttpStatus.OK))
        .catch(next);
});

export default router;
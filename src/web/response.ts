class Response {

    public status?= 0;
    public msg?= 'OK';
    public data?: any = null;

    constructor(status: number, msg: string, data: any) {
        this.status = status;
        this.msg = msg;
        this.data = data;
    }

    public static ok(data?: any): Response {
        return new this(0, 'OK', data)
    }

    public static badRequest(msg: string, data?: any): Response {
        return new this(1, msg || '请求异常', data)
    }

    public static error(msg: string, data?: any): Response {
        return new this(-1, msg || '服务端异常', data);
    }
}

export default Response;
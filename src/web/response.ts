const R = function (status, msg, data) {
    this.status = status || 0;
    this.msg = msg || 'OK';
    this.data = data || null;
}

class response {
    static ok(data?) {
        new R(0, 'OK', data)
    }

    static badRequest(msg, data?) {
        new R(1, msg || '请求异常', data)
    }

    static error(msg, data?) {
        new R(-1, msg || '服务端异常', data)
    }
}

// const response = {

// }

export default response;
const R = function (status, msg, data) {
    this.status = status || 0;
    this.msg = msg || 'OK';
    this.data = data || null;
}

const response = {
    ok: (data) => new R(0, 'OK', data),
    badRequest: (msg, data) => new R(1, msg || '请求异常', data),
    error: (msg, data) => new R(-1, msg || '服务端异常', data),
}

module.exports = response;
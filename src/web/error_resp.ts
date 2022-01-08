export enum HttpStatus {
    OK = 200,
    BAD_REQUEST = 400,
    INTERNAL_SERVER_ERROR = 500,
}

class ErrorRsp {

    public error: string;
    public data?: any = null;

    constructor(error: string, data?: any) {
        this.error = error;
        this.data = data;
    }

    public static of(error: string, data?: any): ErrorRsp {
        return new this(error, data)
    }
}

export default ErrorRsp;
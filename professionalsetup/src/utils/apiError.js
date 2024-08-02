class ApiError extends ERROR{
    constructor(
        statusCode,
        message = "something went wrong! ",
        erros = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode,
        this.data = null,
        this.erros = erros,
        this.success = false,
        this.message = message

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }

    }
}


export {ApiError}
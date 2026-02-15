export class ApiError extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode,
        this.status = `${status}`.startsWith('4') ? 'Fail' : 'Success'
        this.isOperational = true  // optional

        Error.captureStackTrace(this,this.constructor)
    }
}

export const catchAsync = (fn) =>{
    return (req,res,next) => {
        fn(res,req,next).catch(next)
    }
}

//handle jwt error
export const handleJWTError = () => {
    throw new ApiError('Invalid Token . Please log in again',401)
}
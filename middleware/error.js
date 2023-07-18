const ErrorHandler = require("../utils/errorHandler");

module.exports = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "internal server issue";

    //=== Wrong Mongodb error ===
    if(err.name === "CastError" ){
        const message = `Resource not found, Invalid: ${err.path}`;
        err = new ErrorHandler(message,400);
    }

    // mongoose duplicate key errot
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message,400);
    }

    //=== Wrong JWT error ===
    if(err.name === "JsonWebTokenError" ){
        const message = `Json Web Token is Invalid, try again`;
        err = new ErrorHandler(message,400);
    }

    //=== JWT EXPIRE error ===
    if(err.name === "TokenExpireError" ){
        const message = `Json Web Token is Expired, try again`;
        err = new ErrorHandler(message,400);
    }

    res.status(err.statusCode).json({
        success:false,
        message: err.message
    });
};
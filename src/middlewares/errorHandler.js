const errorHandler = (err,req,res,next) => {
    console.log("Error", err)

    const statusCode = res.statusCode || 500;
    const errorMessage = err.message || 'Server Error';
    res.status(statusCode).json({success: false, message : errorMessage})
}

module.exports = errorHandler
function errorHandler(err, req, res, next) {
    console.error(`[ERROR] ${err.message}`);
  
    const statusCode = err.status || 500;
  
    res.status(statusCode).json({
      error: err.name || "Internal Server Error",
      message: err.message || "Something went wrong",
      status: statusCode,
    });
  }
  
  module.exports = errorHandler;
  
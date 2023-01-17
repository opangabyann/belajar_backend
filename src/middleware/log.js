const log = (req, res, next) => {
    console.log(`Log: ${Date.now()} || ${req.ip} || ${req.originalUrl}`);
    next();
  };
  
  module.exports = log;
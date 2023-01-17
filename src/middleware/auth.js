function authMiddleware(req, res, next) {
    console.log('header =>', req.headers);
    console.log('AuthMiddleware');
  
    if (req?.headers?.authorization === '123') {
      next();
    } else {
      return res.status(401).json({
        status: '401 Unauthorized',
        message: 'Unauthorized',
      });
    }
  }
  
  module.exports = authMiddleware;
function Log2Middleware (req,res,next){
    console.log('console log 2')
    next()
}

module.exports = Log2Middleware
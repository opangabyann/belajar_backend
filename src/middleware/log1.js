function Log1Middleware (req,res,next){
    console.log('console log 1')
    next()
}

module.exports = Log1Middleware
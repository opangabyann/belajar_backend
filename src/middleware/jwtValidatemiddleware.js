const jwt = require('jsonwebtoken')
require('dotenv').config()

const jwtValidateMiddleware = (req,res,next)=>{

    const authorization = req.headers.authorization
    if(!authorization) return res.sendStatus(401)
    const bearerHeader = authorization.split(' ')
    const token = bearerHeader[1]
    
    jwt.verify(token,process.env.JWT_SECRET,function(err,decoded){
        if(err){
            return res.status(401).json({
                status : "Fail",
                err : err
            })
        }else{
            req.id = decoded.id,
            req.nama = decoded.nama,
            req.email = decoded.email,
            next()
        }
        // return res.json({
        //     status : decoded,
        // })
    })

    
}

module.exports = jwtValidateMiddleware
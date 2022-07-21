const jwt = require('jsonwebtoken')

module.exports = (req,res,next)=>{
    if(req.method === 'OPTIONS'){
        return next()
    }
    try{
        const token = req.body.acc


        if(!token){
            req.user = {id: ''}
            next()
        }
       
        const decoded = jwt.verify(token,process.env.SECRETKEY)
        req.user = decoded
        next()
    }
    catch(err){
        return 
    }
}
const jwt = require('jsonwebtoken')

module.exports = (req,res,next)=>{
    if(req.method === 'OPTIONS'){
        return next()
    }
    try{
        const token = req.body.acc ? req.body.acc : req.body.data.acc
        const refresh = req.body.ref ? req.body.ref : req.body.data.ref

        if(!token && !refresh){
            return res.status(401).json({message: 'UnauthorizedToken'})
        }
        else if(token && !refresh){
            res.cookie('acc','', {maxAge: -1, httpOnly: true})
            res.cookie('ref','', {maxAge: -1, httpOnly: true})
            return res.status(401).json({message: 'UnauthorizedToken'})
        }
        else if(!token || !refresh){
            return res.status(401).json({message: 'Unauthorized'})
        }
        const decoded = jwt.verify(token,process.env.SECRETKEY)
        req.user = decoded
        next()
    }
    catch(err){
        return res.status(401).json({message: 'Unauthorized'})
    }
}
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../schema/user')
const Token = require('../schema/token')
const Draft = require('../schema/draft')
const shortid = require('shortid')
const user = require('../schema/user')

class UserController {

    async login(req,res) {
        try{
            const {password,email} = req.body
            const emailCheck = await User.findOne({email})

            if(!emailCheck){
                return res.status(400).json({message: 'Invalid email or password'})
            }
            
            const hashPassword = await bcrypt.compare(password,emailCheck.password)
            if(!hashPassword){
                return res.status(400).json({message: 'Invalid email or password'})
            }

            const token = jwt.sign({id: emailCheck.id},process.env.SECRETKEY,{expiresIn: '30m'})
            const refreshToken = jwt.sign({id: emailCheck.id},process.env.REFRESHKEY,{expiresIn: '30d'})
        
            const tokenData = await Token.findOne({user: emailCheck.id})

            if(tokenData){
                tokenData.refreshToken = refreshToken
                await tokenData.save()
                res.cookie('ref',tokenData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            }
            else{
                await Token.create({user: emailCheck.id,refreshToken})
                res.cookie('ref',refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            }

            res.cookie('acc',token, {maxAge: 900000, httpOnly: true})
            return res.status(200).json({name: emailCheck.name,email: emailCheck.email,userid: emailCheck.userid})
        }
        catch(err){
            console.log(err)
            return res.status(400).json({message: 'Bad request'})
        }
    }

    async registration(req,res) {
        try{
            const {password,name,email} = req.body

            const emailCheck = await User.findOne({email})
            if(emailCheck){
                return res.status(400).json({message: 'This email already exists'})
            }

            const nameCheck = await User.findOne({name})
            if(nameCheck){
                return res.status(400).json({message: 'This name already exist'})
            }

            const hashPassword = await bcrypt.hash(password,7)

            const user = new User({
                name,
                email,
                password: hashPassword,
                userid: shortid.generate()
            })

            await user.save()


            return res.status(200).json({})
        }
        catch(err){
            console.log(err)
        }
    }

    async logout(req,res) {
        try{
            const {ref} = req.headers


            if(!ref){
                return res.status(401).json({message: 'UnauthorizedRefresh'})
            }

            await Token.deleteOne({refreshToken: ref})

            res.cookie('acc','', {maxAge: -1, httpOnly: true})
            res.cookie('ref','', {maxAge: -1, httpOnly: true})

            return res.status(200).json({})
        }
        catch(err){
            res.cookie('acc','', {maxAge: -1, httpOnly: true})
            res.cookie('ref','', {maxAge: -1, httpOnly: true})
            
            return res.status(200).json({})
        }
    }

    async auth(req,res) {
        try{
            const id = req.user.id
            const user = await User.findOne({_id: id})

            if(!user){
                return res.status(400).json({message: 'Bad request'})

            }

            const draft = await Draft.findOne({user: user.id, new: true})

            if(!draft){
                const draft = new Draft({
                    user: user.id,
                    draftid: shortid.generate(),
                    new: true
                })
    
                await draft.save()
            }

            return res.status(200).json({
                name: user.name,
                email: user.email,
                userid: user.userid,    
                token: req.cookies.acc
            })
        }
        catch(err){
            return res.status(400).json({message: 'Bad request'})
        }
    }

    async authtest(req,res) {
        try{
           return res.status(200).json({name: 'loh'})
        }
        catch(err){
            return res.status(400).json({message: 'Bad request'})
        }
    }

    async refresh(req,res) {
        try{
            const {ref} = req.cookies

            if(!ref){
                return res.status(401).json({message: 'UnauthorizedRefresh'})
            }
            
            const userData = jwt.verify(ref,process.env.REFRESHKEY)
            const findDb = await Token.findOne({refreshToken: ref})

            if(!userData || !findDb){
                return res.status(401).json({message: 'UnauthorizedRefresh'})
            }

            const token = jwt.sign({id: userData.id},process.env.SECRETKEY,{expiresIn: '30m'})
            const refreshToken = jwt.sign({id: userData.id},process.env.REFRESHKEY,{expiresIn: '30d'})
        
            const tokenData = await Token.findOne({user: userData.id})

            if(tokenData){
                tokenData.refreshToken = refreshToken
                await tokenData.save()
            } 
            else{
                await Token.create({user: userData.id,refreshToken})
            }

            res.cookie('acc',token, {maxAge: 900000, httpOnly: true})
            res.cookie('ref',refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            
            return res.status(200).json({acc: token, ref: refreshToken})

        }
        catch(err){
            console.log(err)
            return res.status(401).json({message: 'UnauthorizedRefresh'})
        }
    }
}

module.exports = new UserController()
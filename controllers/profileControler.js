const User = require('../schema/user')
const jwt = require('jsonwebtoken')
const Post = require('../schema/post')
const Draft = require('../schema/draft')

class ProfileController {

    async getProfile (req,res){
        try{
            const profile = await User.findOne({userid: req.body.userid})

            if(!profile){
                return res.status(404).json({message: 'not found'})
            }

            let decoded = {id: ''}

            if(req.body.ref){
                decoded = jwt.verify(req.body.ref,process.env.REFRESHKEY)
            }

            const posts = await Post.find({user: profile.id})

            return res.status(200).json({
                name: profile.name,
                description: profile.description,
                followers: profile.followers,
                followed: profile.followed,
                registered: profile.registered,
                userid: req.body.userid,
                me: decoded.id === profile.id,
                posts
            })
        }
        catch(err){
            console.log(err)
            return res.status(404).json({message: 'Bad request'})
        }
    }

    async getCommentsProfile (req,res){
        try{
            const profile = await User.findOne({userid: req.body.userid})

            if(!profile){
                return res.status(404).json({message: 'not found'})
            }

            let decoded = {id: ''}

            if(req.body.ref){
                decoded = jwt.verify(req.body.ref,process.env.REFRESHKEY)
            }

            return res.status(200).json({
                name: profile.name,
                description: profile.description,
                followers: profile.followers,
                followed: profile.followed,
                registered: profile.registered,
                userid: req.body.userid,
                me: decoded.id === profile.id,
                comments: [],
            })
        }
        catch(err){
            console.log(err)
            return res.status(404).json({message: 'Bad request'})
        }
    }

    async getDetailsProfile (req,res){
        try{
            const profile = await User.findOne({userid: req.body.userid})

            if(!profile){
                return res.status(404).json({message: 'not found'})
            }

            let decoded = {id: ''}

            if(req.body.ref){
                decoded = jwt.verify(req.body.ref,process.env.REFRESHKEY)
            }

            return res.status(200).json({
                name: profile.name,
                description: profile.description,
                followers: profile.followers,
                followed: profile.followed,
                registered: profile.registered,
                userid: req.body.userid,
                me: decoded.id === profile.id
            })
        }
        catch(err){
            console.log(err)
            return res.status(404).json({message: 'Bad request'})
        }
    }

    async getDraftsProfile (req,res){
        try{
            
            const profile = await User.findOne({userid: req.body.userid})

            if(!profile){
                return res.status(404).json({message: 'not found'})
            }

            if(req.user.id !== profile.id){
                return res.status(404).json({message: 'Bad request'})
            }

            const drafts = await Draft.find({user: req.user.id,new: false}).limit(10)
            
            return res.status(200).json({
                name: profile.name,
                description: profile.description,
                followers: profile.followers,
                followed: profile.followed,
                registered: profile.registered,
                userid: req.body.userid,
                me: req.user.id === profile.id,
                drafts
            })
        }
        catch(err){
            console.log(err)
            return res.status(404).json({message: 'Bad request'})
        }
    }

}


module.exports = new ProfileController()
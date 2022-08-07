const User = require('../schema/user')
const jwt = require('jsonwebtoken')
const Post = require('../schema/post')
const Draft = require('../schema/draft')
const shorid = require('shortid')

class ProfileController {

    async publishPost(req,res){
        try{
            const {draftid} = req.body.data.draft

            const draft = await Draft.findOne({draftid})
        

            if(!draft.header && !draft.blocks.length){
                return res.status(404).json({message: 'Bad request'})
            }

            if(req.user.id !== draft.user){
                return res.status(404).json({message: 'Bad request'})
            }

            const newPost = new Post({
                user: draft.user,
                postid: shorid.generate(),
                header: draft.header,
                blocks: draft.blocks
            })

            await newPost.save()
            await Draft.deleteOne({draftid})
            
            return res.status(200).json({postid: newPost.postid})
        }
        catch(err){
            console.log(err)
            return res.status(404).json({message: 'Bad request'})
        }
    }

    async deletePost(req,res){
        try{
            const post = req.body.data.post
        

            if(req.user.id !== post.user){
                return res.status(404).json({message: 'Bad request'})
            }
            
            await Post.deleteOne({postid: post.postid})
            
            return res.status(200).json({})
        }
        catch(err){
            console.log(err)
            return res.status(404).json({message: 'Bad request'})
        }
    }

}


module.exports = new ProfileController()
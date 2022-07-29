const Draft = require('../schema/draft')
const shortid = require('shortid')
const User = require('../schema/user')

class DraftController {

    async saveDraft (req,res){
        try{

            const {draftid,outputData,header} = req.body.data
            
            const draft = await Draft.findOne({user: req.user.id, draftid: req.body.data.draftid})

            if(!draft){
                return res.status(404).json({message: 'Bad request'})
            }

            if(header.length > 120){
                return res.status(404).json({message: 'Bad request'})
            }

            draft.header = header
            draft.blocks = outputData.blocks
            draft.published = Date.now()
            draft.new = false
            
            await draft.save()
            
            return res.status(200).json({message: ''})
        }
        catch(err){
            console.log(err)
            return res.status(404).json({message: 'Bad request'})
        }
    }

    async deleteDraft (req,res){
        try{

            console.log(1)
            
            const draft = await Draft.deleteOne({user: req.user.id, draftid: req.body.data.draftid})

            if(!draft){
                return res.status(404).json({message: 'Bad request'})
            }
            
            return res.status(200).json({message: ''})
        }
        catch(err){
            console.log(err)
            return res.status(404).json({message: 'Bad request'})
        }
    }

    async getDraft (req,res){
        try{
            const draft = await Draft.findOne({user: req.user.id, new: true})

            if(!draft){
                const newDraft = new Draft({
                    user: user.id,
                    draftid: shortid.generate(),
                    new: true
                })

                await newDraft.save()
                return res.status(200).json({draftid: newDraft.draftid})
            }

            return res.status(200).json({draftid: draft.draftid})
        }
        catch(err){
            return res.status(404).json({message: 'Bad request'})
        }
    }

    async getDraftById (req,res){
        try{
            const draft = await Draft.findOne({draftid: req.body.draftid,user: req.user.id,})

            if(!draft){
                return res.status(404).json({message: 'Bad request'})
            }

            return res.status(200).json({draft})
        }
        catch(err){
            return res.status(404).json({message: 'Bad request'})
        }
    }

    async getDraftPageById (req,res){
        try{
            const draft = await Draft.findOne({draftid: req.body.draftid,user: req.user.id,new: false})

            if(!draft){
                return res.status(404).json({message: 'Bad request'})
            }

            const user = await User.findOne({id: req.user.id},{name: 1,userid: 1})

            if(!user){
                return res.status(404).json({message: 'Bad request'})
            }

            return res.status(200).json({draft,profile: user})
        }
        catch(err){
            return res.status(404).json({message: 'Bad request'})
        }
    }

}

module.exports = new DraftController()
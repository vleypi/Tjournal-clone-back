const {model,Schema,Types} = require('mongoose')


const schema = new Schema({
    name:{
        type:String,
        required: true,
    },
    userid: {
        type:String,
        unique: true,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique:true
    },
    password:{
        type:String,
        required: true,
    },
    registered: {
        type: Date,
        default: Date.now()
    },
    followers: {
        type: Array,
    },
    followed: {
        type: Array,
    },
    description:{
        type: String,
        default: ''
    },
    premium:{
        type: Boolean,
        default: false
    },
    isActivated: {
        type: Boolean,
        default: false
    },
    
})

module.exports = model('User',schema)
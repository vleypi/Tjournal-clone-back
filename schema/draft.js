const {model,Schema,Types} = require('mongoose')

const schema = new Schema({
    user: {
        type: String,
        required: true
    },
    published: {
        type: Date,
        default: Date.now()
    },
    header: {
        type: String,
        default: ''
    },
    blocks: {
        type: Array,
        default: []
    },
    draftid: {
        type:String,
        unique: true,
        required: true
    },
    new: {
        type: Boolean,
        default: true
    }
})

module.exports = model('Draft',schema)
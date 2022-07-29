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
        required: true
    },
    blocks: {
        type: Array
    },
    comments: [
        {
            user: {type: String},
            text: {type: String,required: true},
            published: {type: Date},
            reviews: [
                {
                    user: {type: String}
                }
            ]
        }
    ],
    reviews: [
        {
            user: {type: String},
            review: {type: Number}
        }
    ]
})

module.exports = model('Post',schema)
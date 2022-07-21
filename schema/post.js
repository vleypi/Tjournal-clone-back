const {model,Schema,Types} = require('mongoose')

const schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    published: {
        type: Date,
        default: Date.now()
    },
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
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
    ]
})

module.exports = model('Post',schema)
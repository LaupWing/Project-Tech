const mongoose = require('mongoose')

const messagesSchema = new mongoose.Schema({
    chatRoom:[{
        type: mongoose.Schema.Types.ObjectId
    }],
    messages:[{
        _id: false,
        message: {
            _id: false,
            type: String,
            required: true
        },
        date:{
            _id: false,
            type: Date,
            required: true
        },
        read:{
            _id: false,
            type:Boolean,
            default: false,
            required:true
        }
    }]
})

const Messages = mongoose.model('Messages', messagesSchema)

module.exports = Messages
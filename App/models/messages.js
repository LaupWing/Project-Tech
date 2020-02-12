const mongoose = require('mongoose')

const messagesSchema = new mongoose.Schema({
    chatRoom:[{
        userId:{
            _id: false,
            type: mongoose.Schema.Types.ObjectId
        }
    }],
    messages:[{
        message: {
            type: String,
            required: true
        },
        date:{
            type: Date,
            required: true
        },
        read:{
            type:Boolean,
            default: false,
            required:true
        }
    }]
})

const Messages = mongoose.model('Messages', messagesSchema)

module.exports = Messages
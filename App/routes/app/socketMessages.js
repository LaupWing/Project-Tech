const Messages = require('../../models/messages')
const {activeUsers} = require('./users')

const checkMessages = async (id, socket, req)=>{
    const findUser = activeUsers[`user_${socket.id}`].matchedUsers.find(u=>u.id === id)
    const findRoom = await Messages.findOne({ chatRoom: { $all: [req.user._id, findUser.userId] } })
    
    if(!findRoom){
        const newRoom = new Messages({
            chatRoom:[req.user._id, findUser.userId] 
        })
        await newRoom.save()
    }
}

module.exports = {
    checkMessages
}
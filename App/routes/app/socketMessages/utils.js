const User = require('../../../models/user')

const filteringRooms = (rooms, req)=>{
    const filtered = rooms.filter(room=>{
        if(room.messages.length>0 ||room.emptyChat.find(u=>u.userId.equals(req.user._id))){
            return room
        }
    })
    return filtered
}

const updateActiveUserRooms = (room, socket)=>{
    const updatedRooms = activeUsers[`user_${socket.id}`].rooms.map(r=>{
        if(r.chatId === room.chatId){
            return room
        }
        return r
    }) 
    updateActiveUser(socket, 'rooms', updatedRooms)
}

const formatChatMessages = (messages, req)=>{
    return messages.map(msg=>{
        const copy = {
            ...msg._doc
        }
        if(msg.userSended.equals(req.user._id)){
            copy.userSended = 'you'
        }else{
            copy.userSended = 'otherUser'
        }
        return copy
    })
}

const applyOtherUser = async (room, req)=>{
    const otherUser = room.chatRoom.find(id=>!id.equals(req.user._id))
    const user = await User.findById(otherUser)
    const roomWithOtherUser = {
        ...room._doc,
        otherUser : user,
        chatId    : `room_${Math.random()}`
    }
    return roomWithOtherUser
}

const createChatObject = (room, req)=>{
    return{
        messages:  formatChatMessages(room.messages, req),
        otherUser: {
            name:   room.otherUser.name,
            age:    room.otherUser.age,
            gender: room.otherUser.gender,
            images: room.otherUser.images
        },
        chatId:    room.chatId
    }
}

module.exports = {
    filteringRooms,
    updateActiveUserRooms,
    formatChatMessages,
    applyOtherUser,
    createChatObject
}
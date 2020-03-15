const User            = require('../../../models/user')
const Messages        = require('../../../models/messages')
const {
    activeUsers,
    updateActiveUser} = require('../users')

const filteringRooms = (rooms, req)=>{
    const filtered = rooms.filter(room=>{
        if(room.messages.length>0 ||room.emptyChat.find(u=>u.userId.equals(req.user._id))){
            return room
        }
    })
    return filtered
}

const sortingChatrooms = (a, b)=>{
    const aHighestVal = a.messages.length > 0 
        ?   a.messages.reduce((aS, bS) => {
                return new Date(aS.date) > new Date(bS.date) ? aS : bS;
            })
        :   a.emptyChat.find(x=>x.userId==='you')
    const bHighestVal = b.messages.length > 0 
        ?   b.messages.reduce((aS, bS) => {
                return new Date(aS.date) > new Date(bS.date) ? aS : bS;
            })
        :   b.emptyChat.find(x=>x.userId==='you')
    if(!aHighestVal || !bHighestVal){
        if(!aHighestVal)    return a
                            return b
    }
    if(new Date(aHighestVal.date) > new Date(bHighestVal.date))         return -1
    else if(new Date(aHighestVal.date) < new Date(bHighestVal.date))    return 1
    else                                                                return 0
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

const applyOtherUser = async (room, userId)=>{
    const otherUser = room.chatRoom.find(id=>!id.equals(userId))
    const user = await User.findById(otherUser)
    const roomWithOtherUser = {
        ...room._doc,
        otherUser : user,
        chatId    : `room_${Math.round(Math.random()*1000000)}`
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
        chatId:    room.chatId,
        emptyChat: room.emptyChat.map(u=>{
            const copy = {...u._doc}
            copy.userId.equals(req.user._id) ? copy.userId = 'you' : copy.userId = 'otherUser'
            return copy
        })
    }
}

const updateRead = async (room, socket, req)=>{
    const chatRoom    = await Messages.findById(room._id)
    chatRoom.messages = chatRoom.messages.map(msg=>{
        if(!msg.userSended.equals(req.user._id)){
            msg.read = true
        }
        return msg
    })
    await chatRoom.save()
        
    const formatted = formatChatMessages(chatRoom.messages, req)
    socket.emit('updated unread messages', {
        messages: formatted,
        chatId:   room.chatId
    })
}

module.exports = {
    filteringRooms,
    updateActiveUserRooms,
    formatChatMessages,
    applyOtherUser,
    createChatObject,
    updateRead,
    sortingChatrooms
}
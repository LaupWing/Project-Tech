const Messages = require('../../models/messages')
const User = require('../../models/user')
const {
    activeUsers,
    updateActiveUser} = require('./users')

const checkMessages = async (id, socket, req)=>{
    const findUser = activeUsers[`user_${socket.id}`].matchedUsers.find(u=>u.id === id)
    const findRoom = await Messages.findOne({ chatRoom: { $all: [req.user._id, findUser.userId] } })
    
    if(!findRoom){
        const newRoom = new Messages({
            chatRoom:[req.user._id, findUser.userId],
            emptyChat:[req.user._id] 
        })
        await newRoom.save()
        const otherUser = newRoom.chatRoom.find(id=>!id.equals(req.user._id))
        const user = await User.findById(otherUser)
        
        const room = {
            ...newRoom._doc,
            otherUser : user.images.find(img=>img.mainPicture),
            chatId    : `room_${Math.random()}`
        }
        const updatedRooms = activeUsers[`user_${socket.id}`].rooms 
            ? activeUsers[`user_${socket.id}`].rooms.concat(room) 
            : [room]
        updateActiveUser(socket, 'rooms', updatedRooms)
        
        const chatObject ={
            messages: room.messages,
            userProfilePic: user.images.find(img=>img.mainPicture),
            chatId: room.chatId,
            name: user.name
        }
        socket.emit('send first chat', chatObject)
    }else{
        socket.emit('send chat', findRoom.messages)
    }
}

const getMessages = async (socket, req)=>{
    const roomsPromises = activeUsers[`user_${socket.id}`]
        .matchedUsers.map(user=>{
            return Messages.findOne({ chatRoom: { $all: [req.user._id, user.userId] } })
        })
    const res = await Promise.all(roomsPromises)
    const getUserImgs = res
        .filter(room=>room!==null)
        .map(room=>{
            const copy = {
                ...room._doc,
                chatId: `room_${Math.random()}`
            }
            return copy
        })
        .map(async room=>{
            const findUserId = room.chatRoom.find(id=>!id.equals(req.user._id))
            room.otherUser = await User.findById(findUserId)
            return room
        })
        
    const resWithImgs = await Promise.all(getUserImgs)
    const rooms = resWithImgs.map(r=>{
        r.otherUser = r.otherUser.images.find(img=>img.mainPicture)
        return r
    })

    updateActiveUser(socket, 'rooms', rooms)
    socket.emit('send chatrooms', rooms.map(r=>({
        chatId: r.chatId,
        otherUser: r.otherUser,
        messages: r.messages
    })))
}

module.exports = {
    checkMessages,
    getMessages
}
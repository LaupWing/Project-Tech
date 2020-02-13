const Messages = require('../../models/messages')
const User = require('../../models/user')
const {
    activeUsers,
    updateActiveUser} = require('./users')

const chatPrep = (rooms, req)=>{
    const filtered = rooms.filter(room=>{
        if(room.messages.length>0 ||room.emptyChat.find(u=>u.userId.equals(req.user._id))){
            return room
        }
    })
    return filtered
}

// TODO : Property in chatroom for who deleted the chat.
// SortedBy latest message or Emptychat

const checkMessages = async (id, socket, req)=>{
    const findUser = activeUsers[`user_${socket.id}`].matchedUsers.find(u=>u.id === id)
    const findRoom = await Messages.findOne({ chatRoom: { $all: [req.user._id, findUser.userId] } })
    if(!findRoom || !findRoom.emptyChat.find(ch=>ch.userId.equals(req.user._id))){
        const newRoom = new Messages({
            chatRoom:[req.user._id, findUser.userId],
            emptyChat:[{
                userId:req.user._id
            }] 
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
        const otherUserId = findRoom.chatRoom.find(id=>!id.equals(req.user._id))
        const findChatRoom = activeUsers[`user_${socket.id}`].rooms
            .find(room=>room.chatRoom.some(r=>r.equals(otherUserId)))
            
        const chatObject = {
            messages: findChatRoom.messages,
            userProfilePic: findChatRoom.otherUser,
            chatId: findChatRoom.chatId,
            name: findChatRoom.name
        }
        socket.emit('open existing chat', chatObject)
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
            room.name = room.otherUser.name
            return room
        })
        
    const resWithImgs = await Promise.all(getUserImgs)
    const rooms = resWithImgs.map(r=>{
        r.otherUser = r.otherUser.images.find(img=>img.mainPicture)
        return r
    })
    const filteredRooms = chatPrep(rooms, req)
    updateActiveUser(socket, 'rooms', filteredRooms)
    socket.emit('send chatrooms', filteredRooms.map(sanitizeChatRoom,{req}))
}

function sanitizeChatRoom(room){
    const thisUserEmptyChat = room.emptyChat
            .find(x=>x.userId.equals(this.req.user._id))
    const emptyChat = thisUserEmptyChat.date

    return {
        name: room.name,
        chatId: room.chatId,
        userProfilePic: room.otherUser,
        messages: room.messages,
        emptyChat
    }
}

module.exports = {
    checkMessages,
    getMessages
}
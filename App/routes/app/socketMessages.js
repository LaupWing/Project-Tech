const Messages = require('../../models/messages')
const User = require('../../models/user')
const {
    activeUsers,
    updateActiveUser} = require('./users')

const filteringRooms = (rooms, req)=>{
    const filtered = rooms.filter(room=>{
        if(room.messages.length>0 ||room.emptyChat.find(u=>u.userId.equals(req.user._id))){
            return room
        }
    })
    return filtered
}

const applyImgsAndId = async (room, req)=>{
    const otherUser = room.chatRoom.find(id=>!id.equals(req.user._id))
    const user = await User.findById(otherUser)
    const roomWithImgsAndID = {
        ...room._doc,
        otherUser : user,
        chatId    : `room_${Math.random()}`
    }
    return roomWithImgsAndID
}

const createChatObject = (room)=>{
    return{
        messages:  room.messages,
        otherUser: {
            name:   room.otherUser.name,
            age:    room.otherUser.age,
            gender: room.otherUser.gender,
            images: room.otherUser.images
        },
        chatId:    room.chatId
    }
}
// TODO : Property in chatroom for who deleted the chat.
// SortedBy latest message or Emptychat

const checkMessages = async (id, socket, req)=>{
    const findUser = activeUsers[`user_${socket.id}`].matchedUsers.find(u=>u.id === id)
    const findRoom = await Messages.findOne({ chatRoom: { $all: [req.user._id, findUser.userId] } })
    if(
        !findRoom || 
        !findRoom.emptyChat.find(ch=>ch.userId.equals(req.user._id))
    ){
        const newRoom = new Messages({
            chatRoom  :[req.user._id, findUser.userId],
            emptyChat :[{userId:req.user._id}] 
        })
        await newRoom.save()

        const room = await applyImgsAndId(newRoom, req)
        socket.emit('send first chat', createChatObject(room))
    }else{
        const otherUserId  = findRoom.chatRoom.find(x=>!x.equals(req.user._id))
        const findChatRoom = activeUsers[`user_${socket.id}`].rooms
            .find(room=>room.chatRoom.some(r=>r.equals(otherUserId)))
        const chatObject = createChatObject(findChatRoom)
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
        .map(async room=> await applyImgsAndId(room, req))
    const resWithImgs = await Promise.all(getUserImgs)

    const filteredRooms = filteringRooms(resWithImgs, req)

    updateActiveUser(socket, 'rooms', filteredRooms)
    socket.emit('send chatrooms', filteredRooms.map(createChatObject))
}

const openChat = async(id, socket, req)=>{
    const room =activeUsers[`user_${socket.id}`].rooms.find(r=>r.chatId===id) 
    const chatObject = createChatObject(room)
    socket.emit('open existing chat', chatObject)
}


module.exports = {
    checkMessages,
    getMessages,
    openChat
}
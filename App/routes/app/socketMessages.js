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

        const room       = await applyOtherUser(newRoom, req)
        const chatObj    = createChatObject(room)
        chatObj.messages = formatChatMessages(chatObj.messages, req)
        socket.emit('send first chat', chatObj)
    }else{
        const otherUserId  = findRoom.chatRoom.find(x=>!x.equals(req.user._id))
        const findChatRoom = activeUsers[`user_${socket.id}`].rooms
            .find(room=>room.chatRoom.some(r=>r.equals(otherUserId)))
        const chatObj    = createChatObject(findChatRoom)
        chatObj.messages = formatChatMessages(chatObj.messages, req)
        socket.emit('open existing chat', chatObj)
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
        .map(async room=> await applyOtherUser(room, req))
    const resWithImgs = await Promise.all(getUserImgs)

    const filteredRooms = filteringRooms(resWithImgs, req)

    updateActiveUser(socket, 'rooms', filteredRooms)
    const chatObjects = filteredRooms
        .map(createChatObject)
        .map(c=>{
            c.messages = formatChatMessages(c.messages, req)
            return c
        })
    socket.emit('send chatrooms', chatObjects)
}

const openChat = async(id, socket, req)=>{
    const room =activeUsers[`user_${socket.id}`].rooms.find(r=>r.chatId===id) 
    const chatObject = createChatObject(room)
    chatObject.messages = formatChatMessages(chatObject.messages, req)
    socket.emit('open existing chat', chatObject)
}

const saveMsg = async(msgObj, socket, req)=>{
    const findRoom = activeUsers[`user_${socket.id}`].rooms.find(r=>r.chatId === msgObj.chatId)
    const messageRoom = await Messages.findById(findRoom._id)
    console.log(messageRoom)
    messageRoom.messages = messageRoom.messages.concat({
        message:    msgObj.message,
        date:       msgObj.timestamp,
        userSended: req.user._id
    })

    await messageRoom.save()
    await getMessages(socket, req)

    const againFindRoom = activeUsers[`user_${socket.id}`].rooms.find(q=>q._id.equals(findRoom._id)) 
    const chatObj       = createChatObject(againFindRoom)
    chatObj.messages    = formatChatMessages(chatObj.messages, req)
    
    socket.emit('open existing chat', chatObj)
}

module.exports = {
    checkMessages,
    getMessages,
    openChat,
    saveMsg
}
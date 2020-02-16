const Messages = require('../../models/messages')
const {
    activeUsers,
    updateActiveUser,
    updateUserWhenOnline} = require('./users')

const {
    applyOtherUser,
    createChatObject,
    filteringRooms,
    updateActiveUserRooms
} = require('./socketMessages/utils')

// TODO : Property in chatroom for who deleted the chat.
// SortedBy latest message or Emptychat

const checkMessages = async (id, socket, req)=>{
    const findUser   = activeUsers[`user_${socket.id}`].matchedUsers.find(u=>u.id === id)
    const findRoom   = await Messages.findOne({ chatRoom: { $all: [req.user._id, findUser.userId] } })
    const checkEmpty = () => findRoom && findRoom.emptyChat.find(ch=>ch.userId.equals(req.user._id))

    if(
        !findRoom && 
        !checkEmpty()
    ){
        const newRoom = new Messages({
            chatRoom  :[req.user._id, findUser.userId],
            emptyChat :[{userId:req.user._id}] 
        })
        await newRoom.save()

        const room       = await applyOtherUser(newRoom, req)
        const chatObj    = createChatObject(room, req)
        updateActiveUser(socket, 'currentOpenRoom', room)

        socket.emit('send first chat', chatObj)
    }else{
        const otherUserId  = findRoom.chatRoom.find(x=>!x.equals(req.user._id))
        const findChatRoom = activeUsers[`user_${socket.id}`].rooms
            .find(room=>room.chatRoom.some(r=>r.equals(otherUserId)))
        updateActiveUser(socket, 'currentOpenRoom', findChatRoom)
        const chatObj      = createChatObject(findChatRoom, req)
        socket.emit('open existing chat', chatObj)
    }
}

const initializeMessages = async (socket, req)=>{
    const roomsPromises = activeUsers[`user_${socket.id}`]
        .matchedUsers.map(user=>{
            return Messages.findOne({ chatRoom: { $all: [req.user._id, user.userId] } })
        })
    const res = await Promise.all(roomsPromises)

    const getUserImgs = res
        .filter(room=>room!==null)
        .map(async room=> await applyOtherUser(room, req))

    const resWithImgs   = await Promise.all(getUserImgs)
    const filteredRooms = filteringRooms(resWithImgs, req)

    updateActiveUser(socket, 'rooms', filteredRooms)
    const chatObjects = filteredRooms.map((room)=>createChatObject(room,req))
    socket.emit('initialize chatrooms', chatObjects)
}

const openChat = async(id, socket, req)=>{
    const room       = activeUsers[`user_${socket.id}`].rooms.find(r=>r.chatId===id) 
    const chatObject = createChatObject(room, req)
    updateActiveUser(socket, 'currentOpenRoom', room)
    socket.emit('open existing chat', chatObject)
}

const saveMsg = async(msgObj, socket, req, io)=>{
    const findRoom       = activeUsers[`user_${socket.id}`].rooms.find(r=>r.chatId === msgObj.chatId)
    const messageRoom    = await Messages.findById(findRoom._id)
    messageRoom.messages = messageRoom.messages.concat({
        message:    msgObj.message,
        date:       msgObj.timestamp,
        userSended: req.user._id
    })
    findRoom.messages    = messageRoom.messages

    await messageRoom.save()
    updateActiveUserRooms(findRoom, socket)
    updateUserWhenOnline(findRoom.otherUser,msgObj, io, req)
    
    socket.emit('user sended msg',          {...msgObj, type: 'you'})
    socket.emit('update chatroom in list',  createChatObject(findRoom, req))
}

module.exports = {
    checkMessages,
    initializeMessages,
    openChat,
    saveMsg
}
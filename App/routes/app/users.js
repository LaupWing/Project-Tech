const activeUsers      = {}
const filterByNeeds    = require('../utils/filterByNeeds')
const Messages         = require('../../models/messages')
const User             = require('../../models/user')

const setActiveUser=  async(socket, req)=>{
    if(!activeUsers[`user_${socket.id}`]){
        const filterForUser = await filterByNeeds(req)
        activeUsers[`user_${socket.id}`] ={
            couldBeAMatch:   filterForUser,
            currentMatching: null,
            matchedUsers:    null,
            userId:          req.user._id
        }
    }
}

const reApplyOtherUser = async (room, userId)=>{
    const otherUser = room.chatRoom.find(id=>!id.equals(userId))
    const user = await User.findById(otherUser)
    const roomWithOtherUser = {
        ...room,
        otherUser : user,
        chatId    : `room_${Math.round(Math.random()*1000000)}`
    }
    return roomWithOtherUser
}

const checkIfUserIsOnline = (id)=>{
    const findUser = Object.entries(activeUsers).find(user=>user[1].userId.equals(id))
    return findUser
}

const updateCouldBeAMatch = async(socket, req)=>{
    activeUsers[`user_${socket.id}`].couldBeAMatch = await filterByNeeds(req)
}

const updateActiveUser = (socket, update, value)=>{
    activeUsers[`user_${socket.id}`][update] = value
}

const deleteUser = (socket)=>{
    delete activeUsers[`user_${socket.id}`]
}
const updateUserWhenOnline = async (user, msgObj, io, req, room)=>{
    const userIsOnline = checkIfUserIsOnline(user._id)
    if(userIsOnline){
        const socketId    = userIsOnline[0].replace('user_', '')
        const findRoom    = userIsOnline[1].rooms
            .find(x=>x.chatRoom.some(x=>x.equals(req.user._id)))
        const chatRoom    = findRoom || await reApplyOtherUser(room, user._id) 
        const updatedRoom = await Messages.findById(chatRoom._id)

        console.log('------------chatroom------------')
        console.log(chatRoom)
        if(findRoom){
            activeUsers[`user_${socketId}`].rooms = activeUsers[`user_${socketId}`].rooms
                .map(x=>{
                    if(chatRoom.chatId === x.chatId){
                        x.messages = updatedRoom.messages
                    }
                    return x
                }) 
        }else{
            activeUsers[`user_${socketId}`].rooms.push(chatRoom)
        }

        const messages = chatRoom.messages.map(m=>{
            const copy = {...m._doc}
            copy.userSended = m.userSended.equals(userIsOnline[1].userId) ? 'you' : 'otherUser'
            return copy
        })
        
        if(
            userIsOnline[1].currentOpenRoom &&
            chatRoom.chatId === userIsOnline[1].currentOpenRoom.chatId)
        {
            io.to(socketId).emit('other user message', {
                ...msgObj, 
                type: 'otherUser', 
                chatId: chatRoom.chatId,
                extra: {
                    messages,
                }
            })
        }
        io.to(socketId).emit('update chatroom in list', {
            chatId:     chatRoom.chatId,
            messages,
            otherUser:  req.user.name
        })
    }
}

module.exports = {
    activeUsers,
    deleteUser,
    setActiveUser,
    updateCouldBeAMatch,
    updateActiveUser,
    updateUserWhenOnline
}
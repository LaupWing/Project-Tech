const activeUsers   = {}
const filterByNeeds = require('../utils/filterByNeeds')
const Messages      = require('../../models/messages')

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
const updateUserWhenOnline = async (user, msgObj, io, req)=>{
    const userIsOnline = checkIfUserIsOnline(user._id)
    if(userIsOnline){
        const socketId    = userIsOnline[0].replace('user_', '')
        const chatRoom    = userIsOnline[1].rooms
            .find(x=>x.chatRoom.some(x=>x.equals(req.user._id)))
        const updatedRoom = await Messages.findById(chatRoom._id)
       
        activeUsers[`user_${socketId}`].rooms = activeUsers[`user_${socketId}`].rooms
            .map(x=>{
                if(chatRoom.chatId === x.chatId){
                    x.messages = updatedRoom.messages
                }
                return x
            }) 

        const messages = chatRoom.messages.map(m=>{
            const copy = {
                ...m._doc
            }
            if(m.userSended.equals(userIsOnline[1].userId)){
                copy.userSended = 'you'
            }else{
                copy.userSended = 'otherUser'
            }
            return copy
        })
        io.to(socketId).emit('other user message', {
            ...msgObj, 
            type: 'otherUser', 
            chatId: chatRoom.chatId,
            extra: {
                messages,
            }
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
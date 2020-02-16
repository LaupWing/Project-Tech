const activeUsers   = {}
const filterByNeeds = require('../utils/filterByNeeds')

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
const updateUserWhenOnline = (user, msgObj, io)=>{
    const userIsOnline = checkIfUserIsOnline(user._id)
    if(userIsOnline){
        const socketId = userIsOnline[0].replace('user_', '')
        io.to(socketId).emit('other user message', {...msgObj, type: 'otherUser'})
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
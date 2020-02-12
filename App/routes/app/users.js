const activeUsers   = {}
const filterByNeeds = require('../utils/filterByNeeds')

const setActiveUser=  async(socket, req)=>{
    if(!activeUsers[`user_${socket.id}`]){
        const filterForUser = await filterByNeeds(req)
        activeUsers[`user_${socket.id}`] ={
            couldBeAMatch:   filterForUser,
            currentMatching: null,
            matchedUsers:    null
        }
    }
}

const updateCouldBeAMatch = async(socket, req)=>{
    activeUsers[`user_${socket.id}`].couldBeAMatch = await filterByNeeds(req)
}

const deleteUser = (socket)=>{
    delete activeUsers[`user_${socket.id}`]
}

module.exports = {
    activeUsers,
    deleteUser,
    setActiveUser,
    updateCouldBeAMatch
}
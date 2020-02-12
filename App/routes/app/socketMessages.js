const Messages = require('../../models/messages')
const {activeUsers} = require('./users')

const checkMessages = (id, socket, req)=>{
    const findUser = activeUsers[`user_${socket.id}`].matchedUsers.find(u=>u.id === id)
    console.log(findUser)
    console.log(id)
}

module.exports = {
    checkMessages
}
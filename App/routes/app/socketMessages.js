const Messages = require('../../models/messages')
const {activeUsers} = require('./users')

const checkMessages = (id, socket, req)=>{
    console.log(activeUsers[`user_${socket.id}`].matchedUsers)
    console.log(id)
}

module.exports = {
    checkMessages
}
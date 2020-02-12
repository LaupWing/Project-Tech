const activeUsers ={}

const deleteUser = (socket)=>{
    delete activeUsers[`user_${socket.id}`]
}

module.exports = {
    activeUsers,
    deleteUser
}
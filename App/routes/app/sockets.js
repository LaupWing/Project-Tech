const {
    getMatch,
    acceptedMatch,
    deniedMatch,
    getUserDetail,
    sendMatches
} = require('./socketMatching')
const {
    setActiveUser,
    deleteUser
} = require('./users')
const {
    checkMessages,
    initializeMessages,
    openChat,
    saveMsg
} = require('./socketMessages')

exports.sockets = (req,res)=>{
    const io = req.app.get('socketio')
    io.sockets.once('connection', async (socket)=>{
        console.log(socket.id, '----------connected')
        
        await setActiveUser(socket, req)
        await sendMatches(socket, req)
        await getMatch(socket)
        await initializeMessages(socket, req)
        
        // !!!!!!!!!!!!!!! Need realtime update to
        // ---Matches---
        socket.on('show detail',    (id)=>     getUserDetail(id, socket, req))

        socket.on('denied match',   ()=>       deniedMatch(socket, req))
        socket.on('accepted match', ()=>       acceptedMatch(socket, req))
        
        // ---Messages---
        socket.on('check messages', (id)=>     checkMessages(id, socket, req))
        socket.on('open chat',      (chatId)=> openChat(chatId, socket, req))
        socket.on('send message',   (msgObj)=> saveMsg(msgObj, socket, req, io))

        socket.on('disconnect',     ()=>{
            deleteUser(socket)
        })
    })
}
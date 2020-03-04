const express = require('express')
const router  = new express.Router()
const auth    = require('../middleware/auth')
const {
    getMatch,
    acceptedMatch,
    deniedMatch,
    getUserDetail,
    sendMatches
} = require('./app/socketMatching')
const {
    setActiveUser,
    deleteUser
} = require('./app/users')
const {
    checkMessages,
    initializeMessages,
    openChat,
    saveMsg
} = require('./app/socketMessages')

router
    .get('/',auth, (req,res)=>{
        const io = req.app.get('socketio')
        
        io.once('connection', async (socket)=>{
            console.log('connected', socket.id)
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
                socket.removeAllListeners('denied match')
                socket.removeAllListeners('check messages')
                socket.removeAllListeners('accepted match')
                socket.removeAllListeners('show detail')
                socket.removeAllListeners('open chat')
                socket.removeAllListeners('send message')
                io.removeAllListeners('connection')
                deleteUser(socket)
            })
        })
        res.render('app', {
            title: 'App',
            meta: {
                title:'Dating:App'
            },
            styling: 'app.css',
            user:{
                images: req.user.images,
                name:   req.user.name,
                email:  req.user.email,
                minAge: req.user.minAge,
                maxAge: req.user.maxAge,
                age:    req.user.age,
            },
            script: 'app.js'
        })
    })
module.exports = router
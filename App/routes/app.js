const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const activeUsers ={}
const {
    getMatch,
    acceptedMatch,
    deniedMatch,
    setActiveUser,
    getUserDetail,
    sendMatches
} = require('./app/socketMatchingEvents')

router
    .get('/',auth, (req,res)=>{
        
        const io = req.app.get('socketio')
        
        io.on('connection', async (socket)=>{
            await setActiveUser(socket, req)
            
            console.log('connected', socket.id)
            sendMatches(socket, req)
            socket.on('show detail', (id)=>getUserDetail(id, socket, req))
            socket.on('get match', ()=>getMatch(socket, activeUsers[`user_${socket.id}`]))

            // Need realtime update to
            socket.on('denied match',()=> deniedMatch(socket, req))
            socket.on('accepted match',()=> acceptedMatch(socket, req))
            
            socket.on('disconnect', ()=>{
                socket.removeAllListeners('denied match');
                socket.removeAllListeners('get match');
                socket.removeAllListeners('accepted match');
                socket.removeAllListeners('show detail');
                io.removeAllListeners('connection');
                delete activeUsers[`user_${socket.id}`]
            })
        })
        res.render('app', {
            title: 'App',
            meta: {
                title:'Dating:App'
            },
            styling: 'app.css',
            user:{
                images:req.user.images,
                name: req.user.name,
                email: req.user.email,
                minAge: req.user.minAge,
                maxAge: req.user.maxAge,
                age: req.user.age,
            },
            script: 'app.js'
        })
    })
module.exports = router
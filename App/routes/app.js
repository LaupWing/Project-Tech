const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const filterByNeeds = require('./utils/filterByNeeds')

const activeUsers ={}

router
    .get('/',auth, async (req,res)=>{
        const filterForUser = await filterByNeeds(req)
        
        const io = req.app.get('socketio')
        io.on('connection',(socket)=>{
            socket.removeAllListeners()

            if(!activeUsers[`user_${socket.id}`]){
                activeUsers[`user_${socket.id}`] ={
                    canBeAMatch: filterForUser
                }
            }
            console.log(activeUsers[`user_${socket.id}`].canBeAMatch)
            socket.on('get match', ()=>{
                socket.emit('sending match', activeUsers[`user_${socket.id}`].canBeAMatch)
            })
            socket.on('disconnect', ()=>{
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
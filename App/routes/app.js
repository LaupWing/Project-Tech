const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const filterByNeeds = require('./utils/filterByNeeds')
const bcrypt = require('bcrypt')

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
            
            socket.on('get match', async ()=>{
                const listOfUsers = activeUsers[`user_${socket.id}`].canBeAMatch
                const match = listOfUsers[Math.floor(Math.random() * listOfUsers.length)]
                
                socket.emit('sending match', {
                    name: match.name,
                    images: match.images,
                    age: match.age,
                })
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
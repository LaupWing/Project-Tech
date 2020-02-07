const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const filterByNeeds = require('./utils/filterByNeeds')
const activeUsers ={}
const User = require('../models/user')
router
    .get('/',auth, (req,res)=>{
        
        const io = req.app.get('socketio')
        io.on('connection',async (socket)=>{
            
            if(!activeUsers[`user_${socket.id}`]){
                const filterForUser = await filterByNeeds(req)
                activeUsers[`user_${socket.id}`] ={
                    canBeAMatch: filterForUser,
                    currentMatching: null
                }
            }
            
            socket.removeAllListeners()
            socket.on('get match', async ()=>{
                const listOfUsers = activeUsers[`user_${socket.id}`].canBeAMatch
                const match = listOfUsers[Math.floor(Math.random() * listOfUsers.length)]
                if(match){
                    activeUsers[`user_${socket.id}`].currentMatching = match
                    socket.emit('sending match', {
                        name: match.name,
                        images: match.images,
                        age: match.age,
                    })
                }else{
                    socket.emit('sending match', {
                        name: 'i have nobody',
                        images: [{
                            url:'https://i.ytimg.com/vi/6EEW-9NDM5k/maxresdefault.jpg',
                            mainPicture:true
                        }],
                        age: 'infinite',
                    })
                }
            })
            // Need to update for the matching user also
            // Need realtime update to

            socket.on('denied match',async ()=>{
                const currentMatchingUser = activeUsers[`user_${socket.id}`].currentMatching
                // console.log(socket.id, 'denied')
                // console.log(currentMatchingUser)
                // console.log(req.user)
                req.user.seen = req.user.seen.concat({
                    userId: currentMatchingUser._id,
                    status: 'denied'
                })
                req.user.deniedList = req.user.deniedList.concat({
                    userId: currentMatchingUser._id
                }) 
                await req.user.save()

                const matchingUser = await User.findById(currentMatchingUser._id)
                console.log(matchingUser)
                console.log(matchingUser.seen.findIndex(seen=>seen.userId.equals(req.user._id)))
                if(matchingUser.seen.findIndex(seen=>seen.userId.equals(req.user._id))){
                    console.log('got it')
                }
                // activeUsers[`user_${socket.id}`].canBeAMatch = await filterByNeeds(req)
                // console.log(req.user)
            })
            
            socket.on('accepted match',async()=>{
                const statusChecker = ()=>{
                    if(currentMatchingUser.acceptedList.find(user=>user.userId.equals(req.user._id))){
                        return 'accepted'
                    }else if(currentMatchingUser.deniedList.find(user=>user.userId.equals(req.user._id))){
                        return 'denied'
                    }else{
                        return 'pending'
                    }
                    
                }
                req.user.seen = req.user.seen.concat({
                    userId: currentMatchingUser._id,
                    status: statusChecker()
                })
                req.user.acceptedList = req.user.acceptedList.concat({
                    userId: currentMatchingUser._id
                }) 
                await req.user.save()
                activeUsers[`user_${socket.id}`].canBeAMatch = await filterByNeeds(req)
                console.log(socket.id, 'accepted')
                console.log(activeUsers[`user_${socket.id}`])
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
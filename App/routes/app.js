const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const filterByNeeds = require('./utils/filterByNeeds')
const {
    updateUserStatusCheck,
    updateUserDenied,
    updateMatchingUser} = require('./utils/userUpdates')
    
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
                    currentMatching: null,
                    matchedUsers: null
                }
            }
            const sendMatches = async()=>{
                const onlyMatches = req.user.seen
                    .filter(seen=>seen.status==='accepted')
                // console.log(req.user.seen)
                const promisses = onlyMatches.map((user)=>{
                    return User.findById(user.userId)
                })
                const userList = await Promise.all(promisses)
                const reconstructed = userList
                    .map(user=>{
                        const clicked = onlyMatches.find(match=>match.userId.equals(user._id))
                        const generatedId = `random_${Math.random()}`
                        return {
                            name: user.name,
                            age: user.age,
                            images: user.images,
                            gender: user.gender,
                            clicked: clicked.clicked,
                            id: generatedId,
                            userId: user._id
                        }
                    })
                // console.log(reconstructed)
                activeUsers[`user_${socket.id}`].matchedUsers = reconstructed
                const clientUserList = reconstructed.map(x=>{
                    delete x._id
                    return x
                })
                socket.emit('send matchesList', clientUserList)
            }
            
            
            
            console.log('connected', socket.id)
            sendMatches()
            socket.on('show detail', async (id)=>{
                
                const user = activeUsers[`user_${socket.id}`].matchedUsers.find(user=>user.id === id)
                req.user.seen = req.user.seen.map(u=>{
                    if(u.userId.equals(user.userId)){
                        u.clicked = true
                    }
                    return u
                })
                // await req.user.save()
                sendMatches()
                delete user.clicked
                socket.emit('user detail', user)
            })
            socket.on('get match', async ()=>{
                const listOfUsers = activeUsers[`user_${socket.id}`].canBeAMatch
                const match = listOfUsers[Math.floor(Math.random() * listOfUsers.length)]
                if(match){
                    activeUsers[`user_${socket.id}`].currentMatching = match
                    socket.emit('sending match', {
                        name: match.name,
                        images: match.images,
                        age: match.age,
                        gender: match.gender
                    })
                }else{
                    socket.emit('sending match', {
                        name: 'i have nobody',
                        images: [{
                            url:'https://i.ytimg.com/vi/6EEW-9NDM5k/maxresdefault.jpg',
                            mainPicture:true
                        }],
                        age: 'infinite',
                        gender: 'unknown'
                    })
                }
            })
            // Need realtime update to
            socket.on('denied match',async ()=>{
                const currentMatchingUser = activeUsers[`user_${socket.id}`].currentMatching
                
                await updateUserDenied(req, currentMatchingUser)
                await updateMatchingUser(req, currentMatchingUser, 'denied')

                activeUsers[`user_${socket.id}`].canBeAMatch = await filterByNeeds(req)
            })
            
            socket.on('accepted match',async()=>{
                const currentMatchingUser = activeUsers[`user_${socket.id}`].currentMatching

                await updateUserStatusCheck(req, currentMatchingUser)
                await updateMatchingUser(req, currentMatchingUser, 'accepted')

                activeUsers[`user_${socket.id}`].canBeAMatch = await filterByNeeds(req)

                sendMatches()
            })
            
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
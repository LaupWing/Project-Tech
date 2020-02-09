const filterByNeeds = require('../utils/filterByNeeds')
const {
    updateUserStatusCheck,
    updateUserDenied,
    updateMatchingUser} = require('../utils/userUpdates')
const User = require('../../models/user')
const activeUsers ={}

const getMatch =  async(socket)=>{
    const listOfUsers = activeUsers[`user_${socket.id}`].couldBeAMatch
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
            name: 'mr lonely',
            images: [{
                url:'https://i.ytimg.com/vi/6EEW-9NDM5k/maxresdefault.jpg',
                mainPicture:true
            }],
            age: 'infinite',
            gender: 'unknown'
        })
    }
}

const sendMatches = async(socket, req)=>{
    const onlyMatches = req.user.seen
        .filter(seen=>seen.status==='accepted')
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
    activeUsers[`user_${socket.id}`].matchedUsers = reconstructed
    const clientUserList = reconstructed.map(x=>{
        delete x._id
        return x
    })
    socket.emit('send matchesList', clientUserList)
}

const setActiveUser=  async(socket, req)=>{
    if(!activeUsers[`user_${socket.id}`]){
        const filterForUser = await filterByNeeds(req)
        activeUsers[`user_${socket.id}`] ={
            couldBeAMatch: filterForUser,
            currentMatching: null,
            matchedUsers: null
        }
    }
}

const getUserDetail = async (id, socket, req)=>{
    const user = activeUsers[`user_${socket.id}`].matchedUsers.find(user=>user.id === id)
    req.user.seen = req.user.seen.map(u=>{
        if(u.userId.equals(user.userId)){
            u.clicked = true
        }
        return u
    })
    await req.user.save()
    sendMatches(socket,req)
    delete user.clicked
    socket.emit('user detail', user)
}

const deniedMatch = async (socket, req)=>{
    const currentMatchingUser = activeUsers[`user_${socket.id}`].currentMatching
    try{
        await updateUserDenied(req, currentMatchingUser)
        await updateMatchingUser(req, currentMatchingUser, 'denied')
        activeUsers[`user_${socket.id}`].couldBeAMatch = await filterByNeeds(req)
        await getMatch(socket)
    }catch(e){
        console.log('deniedMatch-----------Something went wrong', e)
    }
}

const acceptedMatch = async(socket, req)=>{
    const currentMatchingUser = activeUsers[`user_${socket.id}`].currentMatching
    try{
        await updateMatchingUser(req, currentMatchingUser, 'accepted')
        await updateUserStatusCheck(req, currentMatchingUser)
        activeUsers[`user_${socket.id}`].couldBeAMatch = await filterByNeeds(req)
        await sendMatches(socket, req)
        await getMatch(socket)
    }catch(e){
        console.log('acceptMatch-----------Something went wrong', e)
    }
}
module.exports ={
    getMatch,
    setActiveUser,
    sendMatches,
    getUserDetail,
    deniedMatch,
    acceptedMatch
}
const User = require('../../models/user')

const updateUsersStatus =async(req, currentMatchingUser, socket)=>{
    const {user} = req
    const getUpToDateMatchingUser = await User.findById(currentMatchingUser)

    const statusChecker = ()=>{
        if(getUpToDateMatchingUser.acceptedList.find(user=>user.userId.equals(req.user._id))){
            socket.emit('you got a match', currentMatchingUser)
            return 'accepted'
        }else if(getUpToDateMatchingUser.deniedList.find(user=>user.userId.equals(req.user._id))){
            return 'denied'
        }else{
            return 'pending'
        }
    }

    user.seen = user.seen.concat({
        userId: currentMatchingUser._id,
        status: statusChecker()
    })
    user.acceptedList = user.acceptedList.concat({
        userId: currentMatchingUser._id
    })
    try{
        await user.save()
    }catch(e){
        console.log('updateUsersStatus-----------Something went wrong', e)
    }
}

const updateUserDenied =async (req, currentMatchingUser)=>{
    const {user} = req
    user.seen = user.seen.concat({
        userId: currentMatchingUser._id,
        status: 'denied'
    })
    user.deniedList = user.deniedList.concat({
        userId: currentMatchingUser._id
    }) 
    try{
        await user.save()
    }catch(e){
        console.log('updateUserDenied-----------Something went wrong', e)
    }
}

const updateMatchingUser = async (req, currentMatchingUser, status)=>{
    const matchingUser = await User.findById(currentMatchingUser._id)
    const indexSeen = matchingUser.seen.findIndex(seen=>seen.userId.equals(req.user._id))
    
    if(indexSeen>=0){
        if(matchingUser.seen[indexSeen].status === 'denied'){
            return
        }
        matchingUser.seen[indexSeen].status = status
        try{
            matchingUser.save()
        }catch(e){
            console.log('updateMatchingUser-----------Something went wrong', e)
        }
    }
}

module.exports ={
    updateUsersStatus,
    updateUserDenied,
    updateMatchingUser
}
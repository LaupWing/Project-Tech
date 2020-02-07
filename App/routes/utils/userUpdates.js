const User = require('../../models/user')

const updateUserStatusCheck =async(req, currentMatchingUser)=>{
    const {user} = req

    const statusChecker = ()=>{
        if(currentMatchingUser.acceptedList.find(user=>user.userId.equals(req.user._id))){
            return 'accepted'
        }else if(currentMatchingUser.deniedList.find(user=>user.userId.equals(req.user._id))){
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
    await user.save()
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
    await user.save()
}

const updateMatchingUser = async (req, currentMatchingUser, status)=>{
    const matchingUser = await User.findById(currentMatchingUser._id)
    const indexSeen = matchingUser.seen.findIndex(seen=>seen.userId.equals(req.user._id))
    if(indexSeen>=0){
        if(matchingUser.seen[indexSeen].status === 'denied'){
            return
        }
        matchingUser.seen[indexSeen].status = status
        matchingUser.save()
    }
}

module.exports ={
    updateUserStatusCheck,
    updateUserDenied,
    updateMatchingUser
}
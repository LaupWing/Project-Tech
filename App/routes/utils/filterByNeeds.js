const User = require('../../models/user')

module.exports = async (req)=>{
    const dbFiltered = await User.find({})
        .where('age').gt(req.user.minAge).lt(req.user.maxAge)
        .where('minAge').lt(req.user.age)
        .where('maxAge').gt(req.user.age)
    return dbFiltered.filter(user=>!req.user.seen.some(seen=>seen.userId.equals(user._id)) && req.user._id !== user._id)
}
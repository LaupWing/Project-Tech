const User = require('../../models/user')

module.exports = async (user)=>{
    const dbFiltered = await User.find({})
        .where('minAge').gt(user.minAge).lt(user.maxAge)
    return dbFiltered.filter(user=>!req.user.seen.some(seen=>seen.userId===user._id))
}
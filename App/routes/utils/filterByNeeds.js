const User = require('../../models/user')

module.exports = async (req)=>{
    const dbFiltered = await User.find({})
        .where('minAge').gt(req.user.minAge).lt(req.user.maxAge)
    return dbFiltered.filter(user=>!req.user.seen.some(seen=>seen.userId===user._id))
}
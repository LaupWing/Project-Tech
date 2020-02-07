const User = require('../../models/user')

module.exports = async (req)=>{
    const dbFiltered = await User.find({})
        .where('age').gte(req.user.minAge).lte(req.user.maxAge)
        .where('minAge').lte(req.user.age)
        .where('maxAge').gte(req.user.age)

    return dbFiltered
        .filter(user=>{
            return !req.user.seen.some(seen=>seen.userId.equals(user._id)) && !req.user._id.equals(user._id)
        })
}
const User = require('../../models/user')

module.exports = async (req)=>{
    const dbFiltered = req.session.user.gender_preference === 'both' 
        ?   await User.find({})
                .where('age').gte(req.session.user.minAge).lte(req.session.user.maxAge)
                .where('gender_preference').in(['both', req.session.user.gender])
                .where('minAge').lte(req.session.user.age)
                .where('maxAge').gte(req.session.user.age)
        :   await User.find({})
                .where('gender').equals(req.session.user.gender_preference)
                .where('gender_preference').in(['both', req.session.user.gender])
                .where('age').gte(req.session.user.minAge).lte(req.session.user.maxAge)
                .where('minAge').lte(req.session.user.age)
                .where('maxAge').gte(req.session.user.age)

    return dbFiltered
        .filter(user=>{
            return !req.session.user.seen.some(seen=>seen.userId.equals(user._id)) && !req.session.user._id.equals(user._id)
        })
}
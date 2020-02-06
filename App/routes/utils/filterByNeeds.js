const User = require('../../models/user')

module.exports = (user)=>{
    return User.find({})
        .where('minAge').gt(user.minAge).lt(user.maxAge)
}
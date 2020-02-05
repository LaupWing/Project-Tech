const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req,res,next)=>{
    
    try{
        const cookie = req.get('cookie')
        const token = cookie
            .split(';')
            .find(c=>c.includes('dating_token='))
            .trim()
            .split('dating_token=')
            .filter(x=>x!=='')[0]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})
        if(!user){
            throw new Error()
        }
        req.user = user
        req.token = token
        next()
    }
    catch(e){
        console.log('please auth')
        // {error: 'Please Authenticate properly by using the right the force'}
        res.status(400).send()
    }
}

module.exports = auth
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
        delete req.user.password
        delete req.user.tokens
        req.token = token
        next()
    }
    catch(e){
        res.redirect('/login')
        // res.render('test')
    }
}

module.exports = auth
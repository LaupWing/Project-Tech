const cookieCheck = async (req,res,next)=>{    
    const cookie = req.get('cookie')
    const token = cookie
        .split(';')
        .find(c=>c.includes('dating_token='))
    
    if(token){
        return res.redirect('/')
    }
    next()
}

module.exports = cookieCheck
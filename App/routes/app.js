const express   = require('express')
const router    = new express.Router()
const auth      = require('../middleware/auth')
const {sockets} = require('./app/sockets')

router  
    .get('/',auth, (req,res)=>{
        sockets(req,res)
        res.render('app', {
            title: 'App',
            meta: {
                title:'Dating:App'
            },
            styling: 'app.css',
            user:{
                images: req.session.user.images,
                name:   req.session.user.name,
                email:  req.session.user.email,
                minAge: req.session.user.minAge,
                maxAge: req.session.user.maxAge,
                age:    req.session.user.age,
            },
            script: 'app.js'
        })
    })
module.exports = router
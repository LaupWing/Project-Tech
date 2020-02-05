const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')

router
    .get('/',auth, (req,res)=>{
        console.log(req.user)
        res.render('app', {
            title: 'App',
            meta: {
                title:'Dating:App'
            },
            styling: 'app.css'
        })
    })
module.exports = router
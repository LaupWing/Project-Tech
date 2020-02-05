const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')

router
    .get('/',auth, (req,res)=>{
        res.render('matchmaking', {
            title: 'Matchmaking',
            meta: {
                title:'Dating:Matchmaking'
            },
            styling: 'app.css'
        })
    })
module.exports = router
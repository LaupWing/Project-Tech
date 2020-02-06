const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const filterByNeeds = require('./utils/filterByNeeds')

router
    .get('/',auth, async (req,res)=>{
        const filterForUser = await filterByNeeds(req.user)
        console.log(filterForUser)
        res.render('app', {
            title: 'App',
            meta: {
                title:'Dating:App'
            },
            styling: 'app.css',
            user:{
                images:req.user.images,
                name: req.user.name,
                email: req.user.email,
                minAge: req.user.minAge,
                maxAge: req.user.maxAge,
                age: req.user.age,
            },
            script: 'app.js'
        })
    })
    .get('/matching', auth, (req,res)=>{
        
    })
module.exports = router
const express = require('express')
const router = new express.Router()

router
    .get('/', (req,res)=>{
        res.render('matchmaking')
    })
    .get('/user', (req,res)=>{
        res.render('user')
    })
   .post('/auth', (req,res)=>{
       res.render('auth')
   })

module.exports = router
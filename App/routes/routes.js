const express = require('express')
const router = new express.Router()

router
    .get('/', (req,res)=>{
        res.render('matchmaking', {
            title: 'Matchmaking',
            headTitle: 'Date:Matchmaking'
        })
    })
    .get('/user', (req,res)=>{
        res.render('user')
    })
    .get('/messages', (req,res)=>{
        res.render('messages')
    })
    .get('/auth', (req,res)=>{
        res.render('auth')
    })
    .post('/auth', (req,res)=>{
        res.render('auth')
    })

module.exports = router
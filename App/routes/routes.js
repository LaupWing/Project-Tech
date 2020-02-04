const express = require('express')
const router = new express.Router()

router
    .get('/', (req,res)=>{
        res.render('matchmaking', {
            title: 'Matchmaking',
            meta: {
                title:'Dating:Matchmaking'
            }
        })
    })
    .get('/user', (req,res)=>{
        res.render('user',{
            meta:{
                title: 'Dating:User'
            }
        })
    })
    .get('/messages', (req,res)=>{
        res.render('messages',{
            meta:{
                title: 'Dating:Messages'
            }
        })
    })
    .get('/auth', (req,res)=>{
        res.render('auth',{
            title: 'Authenticate',
            meta:{
                title: `Dating:Auth`
            }
        })
    })
    .post('/auth', (req,res)=>{
        const {
            email,
            password,
            age,
            min,
            max} = req.body
        console.log({email, password,age,min,max})
        res.send('sended')
    })

module.exports = router
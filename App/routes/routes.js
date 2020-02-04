const express = require('express')
const router = new express.Router()
const User = require('../models/user')

router
    .get('/', (req,res)=>{
        console.log(req.headers)
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
    .post('/auth', async (req,res)=>{
        const {
            email,
            password,
            passwordCheck,
            age,
            name,
            minAge,
            maxAge} = req.body
        // This below is check on the client side but just to be save
        if(passwordCheck!==password){    
            return res.redirect('/auth')
        }
        const user = new User({
            email,
            password,
            age,
            minAge,
            maxAge,
            name
        })
        try{
            await user.save()
            await user.generateAuthToken()
            res.send('postted')
        }catch(e){
            console.log(e)
            res.status(400).send(e)
        }
    })

module.exports = router
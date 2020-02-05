const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')

router
    .get('/',auth, (req,res)=>{
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
    .get('/login', (req,res)=>{
        res.render('login',{
            title: 'Login',
            meta:{
                title: `Dating:Login`
            }
        })
    })
    .get('/signup', (req,res)=>{
        res.render('signup',{
            title: 'Authenticate',
            meta:{
                title: `Dating:Auth`
            },
            styling: 'auth.css',
            script: 'signup.js'
        })
    })
    .post('/signup', async (req,res)=>{
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
            const token = await user.generateAuthToken()
            res.cookie('dating_token',token,{
                httpOnly:true,
                maxAge: (24*7) * 60 * 60 * 1000 // 7 days in miliseconds because it is in miliseconds
            })
            res.send('postted')
        }catch(e){
            res.status(400).send(e)
        }
    })

module.exports = router
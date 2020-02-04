const express = require('express')
const router = new express.Router()
const User = require('../models/user')

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
    .post('/auth', async (req,res)=>{
        const {
            email,
            password,
            passwordCheck,
            age,
            name,
            minAge,
            maxAge} = req.body
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
            console.log(user)
        }catch(e){
            res.status(400).send(e)
        }
    })

module.exports = router
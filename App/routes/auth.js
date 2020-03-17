const express = require('express')
const router  = new express.Router()
const User    = require('../models/user')
const auth    = require('../middleware/auth')
const multer  = require('multer')
const imgur   = require('imgur')
const upload  = multer({
    limits:{
        fileSize: 1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})

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
    .get('/login', (req,res)=>{
        res.render('login',{
            title: 'Login',
            meta:{
                title: `Dating:Login`
            },
            styling: 'auth.css',
        })
    })
    .get('/signup', (req,res)=>{
        res.render('signup',{
            title: 'Signup',
            meta:{
                title: `Dating:Signup`
            },
            styling: 'auth.css',
            script: 'signup.js'
        })
    })
    .post('/login', async (req,res)=>{
        try{
            const user = await User.findByCredentials(
                req.body.email,
                req.body.password
            )
            const token = await user.generateAuthToken()
            res.cookie('dating_token',token,{
                httpOnly:true,
                maxAge: (24*7) * 60 * 60 * 1000 // 7 days in miliseconds because it is in miliseconds
            })
            res.redirect('/')
        }catch(e){
            res.render('login',{
                title: 'Login',
                meta:{
                    title: `Dating:Login`
                },
                styling: 'auth.css',
                script: 'signup.js',
                error: 'Invalid password/email'
            })
        }
    })
    .post('/signup',upload.single('image'), async (req,res)=>{
        const {
            email,
            password,
            passwordCheck,
            gender_preference,
            age,
            name,
            minAge,
            gender,
            maxAge} = req.body
        // This below is check on the client side but just to be save
        if(passwordCheck!==password){    
            return res.redirect('/auth')
        }
        const base64data = new Buffer.from(req.file.buffer).toString('base64')
        let image=null
        try{
            const res = await imgur.uploadBase64(base64data)
            image = res.data.link
        }catch(e){
            image = base64data
        }
        
        const user = new User({
            email,
            password,
            age,
            minAge,
            gender_preference,
            maxAge,
            name,
            gender,
            images:[
                {
                    url: image,
                    mainPicture: true
                }
            ]
        })
        try{
            await user.save()
            const token = await user.generateAuthToken()
            res.cookie('dating_token',token,{
                httpOnly:true,
                maxAge: (24*7) * 60 * 60 * 1000 // 7 days in miliseconds because it is in miliseconds
            })
            res.redirect('/')
        }catch(e){
            res.redirect('/login')
        }
    })
    .get('/logout', auth, async (req,res)=>{
        try{
            req.user.tokens = req.user.tokens.filter(token=>token.token !== req.token)
            await req.user.save()
            res
                .clearCookie('dating_token')
                .redirect('/login')
        }catch(e){
            res.status(500).send(e)
        }
    })

module.exports = router
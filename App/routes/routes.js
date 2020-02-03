const express = require('express')
const router = new express.Router()

router
    .get('/', (req,res)=>{
        res.send('test')
    })
    .get('/test', (req,res)=>{
        res.render('test',{title:'hi', message: 'test'})
    })

module.exports = router
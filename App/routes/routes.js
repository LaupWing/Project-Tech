const express = require('express')
const router = new express.Router()
const path =  require('path')

router
    .get('/', (req,res)=>{
        console.log(req)
    })

module.exports = router
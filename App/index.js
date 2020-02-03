// Requiring all the packages
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()
const port = process.env.PORT || 1333

console.log()

app
    .use(cors())
    .use(bodyParser.json({limt: '50mb'}))
    .use(express.static('public'))
    .use(express.static('assets'))
    .use('/static', express.static(path.join(__dirname, 'public')))
    .listen(port, ()=>console.log(`Server is listening to port${port}`))
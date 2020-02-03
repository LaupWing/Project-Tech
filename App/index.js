// Requiring all the packages
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')

const routes = require('./routes/routes') 
const app = express()
const port = process.env.PORT || 1333

app
    .use(cors())
    .use(bodyParser.json({limt: '50mb'}))
    .use('/static',express.static(path.join(__dirname, 'public')))
    .use(routes)
    .listen(port, ()=>console.log(`Server is listening to port${port}`))
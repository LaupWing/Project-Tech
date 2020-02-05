// Requiring all the third party packages
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')

// Own files
require('./db/mongoose') // initialize the db connection 
const authRoutes = require('./routes/auth')
const appRoutes = require('./routes/app')

const app = express()
const port = process.env.PORT

app
    .use(express.urlencoded({extended:false}))
    .use(cors())
    .use(bodyParser.json({limit: '50mb'}))
    .use('/static',express.static(path.join(__dirname, 'public')))
    .use(appRoutes)
    .use(authRoutes)
    .set('view engine', 'pug')
    .set('views', path.join(__dirname,'view'))
    .listen(port, ()=>console.log(`Server is listening to port ${port}`))
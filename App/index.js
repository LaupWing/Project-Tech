// Requiring all the third party packages
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')

// Own packages
require('./db/mongoose') // initialize the db connection 
const routes = require('./routes/routes')

const app = express()
const port = process.env.PORT

app
    .use(cors())
    .use(bodyParser.json({limit: '50mb'}))
    .use('/static',express.static(path.join(__dirname, 'public')))
    .use(routes)
    .set('view engine', 'pug')
    .set('views', path.join(__dirname,'view'))
    .listen(port, ()=>console.log(`Server is listening to port ${port}`))
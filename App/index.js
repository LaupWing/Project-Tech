// Requiring all the third party packages
const express    = require('express')
const cors       = require('cors')
const bodyParser = require('body-parser')
const path       = require('path')
const http       = require('http')
const socketio   = require('socket.io')

// Own files
require('./db/mongoose') // initialize the db connection 
const authRoutes = require('./routes/auth')
const appRoutes  = require('./routes/app')

const app    = express()
const server = http.createServer(app)
const port   = process.env.PORT
const io     = socketio.listen(server)

app
    .use(express.urlencoded({extended:false}))
    .use(cors())
    .use(bodyParser.json({limit: '50mb'}))
    .use('/static',express.static(path.join(__dirname, 'public')))
    .set('socketio', io)
    .use(appRoutes)
    .use(authRoutes)
    .set('view engine', 'pug')
    .set('views', path.join(__dirname,'view'))

server.listen(port, ()=>console.log(`Server is listening to port ${port}`))
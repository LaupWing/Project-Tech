const socket = io()
import Matching     from './app-parts/Matching.js'
import MatchesList  from './app-parts/MatchesList.js'
import Details      from './app-parts/Details.js'
import SwitchPanel  from './app-parts/SwitchPanel.js'
import SwitchList   from './app-parts/SwitchList.js'
import Messages     from './app-parts/Messages.js'

const init = ()=>{
    const matches     = new Matching(socket)
    const matchesList = new MatchesList((e)=>socket.emit('show detail', e.target.id))
    const messages    = new Messages(socket)
    const details     = new Details(socket)
    new SwitchPanel()
    new SwitchList()

    // Sockets
    socket.emit('get match')
    socket.emit('get messages')
    socket.on('send chatrooms', messages.renderMessages.bind(messages))
    socket.on('sending match', matches.renderMatch.bind(matches))
    socket.on('send matchesList', matchesList.renderList.bind(matchesList))
    socket.on('user detail', details.gotUserDetail.bind(details))
    socket.on('send chat', messages.renderStarterMessage)
}

init()
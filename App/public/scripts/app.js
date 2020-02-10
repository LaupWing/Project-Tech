const socket = io()
import Matching from './app-parts/Matching.js'
import MatchesList from './app-parts/MatchesList.js'
import Details from './app-parts/Details.js'
import SwitchPanel from './app-parts/SwitchPanel.js'
import SwitchList from './app-parts/SwitchList.js'

const init = ()=>{
    const matches = new Matching(socket)
    const matchesList = new MatchesList((e)=>socket.emit('show detail', e.target.id))
    const details = new Details()
    new SwitchPanel()
    new SwitchList()

    // Sockets
    socket.emit('get match')
    socket.on('sending match', matches.renderMatch.bind(matches))
    socket.on('send matchesList', matchesList.renderList.bind(matchesList))
    socket.on('user detail', details.gotUserDetail.bind(details))
}

init()
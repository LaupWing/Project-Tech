const socket = io()
import Matching      from './app-parts/Matching.js'
import MatchesList   from './app-parts/MatchesList.js'
import Details       from './app-parts/Details.js'
import SwitchPanel   from './app-parts/SwitchPanel.js'
import SwitchList    from './app-parts/SwitchList.js'
import Messages      from './app-parts/Messages.js'
import Mobile        from './app-parts/Mobile/Mobile.js'
import Chat          from './app-parts/Chat.js'
import deleteActives from './app-parts/utils/deleteActives.js'

const init = ()=>{
    const mobile      = window.innerWidth <= 500 && new Mobile()
    const matches     = new Matching(socket)
    const matchesList = new MatchesList((e)=>{
        deleteActives()
        socket.emit('show detail', e.target.id)
    }, mobile)
    const chat        = new Chat(socket)
    const messages    = new Messages(socket, chat, mobile)
    const details     = new Details(socket)
    new SwitchPanel()
    new SwitchList()


    // Sockets
    socket.on('sending match',           matches.renderMatch.bind(matches))
    socket.on('send matchesList',        matchesList.renderList.bind(matchesList))
    socket.on('user detail',             details.gotUserDetail.bind(details))
    socket.on('initialize chatrooms',    messages.initializeMessages.bind(messages))
    socket.on('send first chat',         messages.renderFirstMessage.bind(messages))
    socket.on('updated unread messages', messages.updateUnreadOfChat.bind(messages))
    socket.on('update chatroom in list', messages.updateChatRoomInList.bind(messages))
    socket.on('user sended msg',         chat.addMessage.bind(chat))
    socket.on('open existing chat',      chat.openExistingChat.bind(chat))
    socket.on('other user message',      chat.addMessage.bind(chat))
}

window.addEventListener('load', ()=>init())
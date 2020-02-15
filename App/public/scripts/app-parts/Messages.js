import Chat from './Chat.js'
import deleteActives from './utils/deleteActives.js'
export default class Messages{
    constructor(socket){
        this.messages   = document.querySelector('.active-list .message-list')
        this.messageBtn = document.querySelector('.menu .message-list')
        this.chat       = new Chat(socket)
        this.socket     = socket
    }
    renderFirstMessage(room){
        if(this.messages.querySelector('p.info')){
            this.removeChilds()
        }
        this.renderMessageListItem(room)
        this.chat.renderChat(room)
        this.messageBtn.click()
    }
    updateChatRoomInList(room){
        const rooms     = Array.from(this.messages.querySelectorAll('li'))
        const roomIndex = rooms.map(r=>r.id).indexOf(room.chatId)
        const roomEl    = document.getElementById(room.chatId)

        if(roomIndex===0){
            const displayMsg = `${room.messages[room.messages.length-1].userSended}: ${room.messages[room.messages.length-1].message}`
            roomEl.querySelector('.message').textContent = displayMsg
        }
        else{
            roomEl.classList.add('dissapear')
            roomEl.addEventListener('transitionend', ()=>{
                const clone = roomEl.cloneNode(true)
                this.messages.removeChild(roomEl)
                this.messages.insertAdjacentElement('afterbegin', clone)
                setTimeout(()=>{
                    document.getElementById(room.chatId).classList.remove('dissapear')
                })
            })
        }
    }
    openExistingChat(room){
        const messageEl = document.getElementById(room.chatId)
        this.chat.renderChat(room)
        messageEl.classList.add('active')
        this.messageBtn.click()
    }
    renderMessageListItem(room){
        const li     = document.createElement('li')
        const pname  = document.createElement('p')
        const pmsg   = document.createElement('p')
        const img    = document.createElement('img')
        const info   = document.createElement('div')
        const unread = document.createElement('div')

        li.id            = room.chatId
        info.className   = 'info'
        unread.className = 'unread'
        li.className     = 'message'
        pname.className  = 'name'
        pmsg.className   = 'message'
        img.src          = room.otherUser.images.find(img=>img.mainPicture).url
        
        unread.textContent = this.unread(room.messages).length
        pname.textContent  = room.otherUser.name
        const sended       = ()=> room.messages[room.messages.length-1].userSended === 'you' ? 'you' :  room.otherUser.name
        pmsg.textContent   = room.messages.length === 0 
            ? 'Send your first message!' 
            : `${sended()}: ${room.messages[room.messages.length-1].message}`

        info.appendChild(pname)
        info.appendChild(pmsg)
        li.appendChild(img)
        li.appendChild(info)
        this.unread(room.messages).length > 0 && li.appendChild(unread)
        li.addEventListener('click', this.openChat.bind(this))
        this.messages.insertAdjacentElement('afterbegin', li)
    }
    unread(messages){
        return messages
            .filter(msg=>msg.userSended === 'otherUser' && !msg.read)
    }
    openChat(e){
        deleteActives()
        const infoBtn = document.querySelector('main .main-nav .info')
        infoBtn.click()
        const li = e.target.closest('li')
        this.socket.emit('open chat', li.id)
    }
    initializeMessages(rooms){
        this.removeChilds()
        rooms.forEach(room=>this.renderMessageListItem(room))
    }
    removeChilds(){
        const parent = this.messages
        while (parent.firstChild) {
            parent.firstChild.remove()
        }
    }
}


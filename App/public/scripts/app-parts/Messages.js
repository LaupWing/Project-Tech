import deleteActives from './utils/deleteActives.js'
import Component from './utils/component.js'
export default class Messages extends Component{
    constructor(socket, chat){
        super()
        this.messages    = document.querySelector('.active-list .message-list')
        this.messageBtn  = document.querySelector('.menu .message-list')
        this.chat        = chat
        this.socket      = socket
        this.totalUnread = 0
    }
    renderFirstMessage(room){
        if(this.messages.querySelector('p.info')){
            this.removeChilds(this.messages)
        }
        this.renderMessageListItem(room)
        this.chat.renderChat(room)
        this.messageBtn.click()
    }
    updateUnreadNumber({messages, chatId}){
        const chatRoom = document.getElementById(chatId)
        const unread   = chatRoom.querySelector('.unread')
        if(unread){
            const filterUnread = messages.filter(x=>x.userSended!=='you' && !x.read)
            if(filterUnread.length === 0){
                chatRoom.removeChild(unread)
            }else{
                unread.textContent = filterUnread.length
            }
        }
    }
    updateChatRoomInList(room){
        const rooms      = Array.from(this.messages.querySelectorAll('li'))
        const roomIndex  = rooms.map(r=>r.id).indexOf(room.chatId)
        const roomEl     = document.getElementById(room.chatId)
        const userSended = room.messages[room.messages.length-1].userSended === 'you' 
            ? 'you' 
            : room.otherUser
        const displayMsg = `${userSended}: ${room.messages[room.messages.length-1].message}`
        if(roomIndex===0){
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
                    document.querySelector(`#${room.chatId} .message`).textContent = displayMsg
                })
            })
        }
    }
    renderMessageListItem(room){
        const li     = document.createElement('li')
        const pname  = document.createElement('p')
        const pmsg   = document.createElement('p')
        const img    = document.createElement('img')
        const info   = document.createElement('div')
        const unread = document.createElement('div')
        console.log(this.create(`li#${room.chatId}`).el)
        console.log(this.create(`p.name`).el)
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
        this.totalUnread += this.unread(room.messages).length
        this.totalUnread > 0 
            ? document.querySelector('.message-list span').textContent = ` (${this.totalUnread})` 
            : null
        
        li.addEventListener('click', this.openChat.bind(this))
        this.messages.insertAdjacentElement('beforeend', li)
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
        li.querySelector('.unread') 
            ? document.querySelector('.message-list span').textContent = ` (${this.totalUnread -= Number(li.querySelector('.unread').textContent)})`
            : null 
        this.socket.emit('open chat', li.id)
    }
    initializeMessages(rooms){
        if(rooms.length===0 || !rooms)  return
        this.removeChilds(this.messages)
        rooms.forEach(room=>this.renderMessageListItem(room))
    }
}


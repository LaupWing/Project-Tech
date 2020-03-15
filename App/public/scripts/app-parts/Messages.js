import deleteActives from './utils/deleteActives.js'
import Component from './utils/component.js'

export default class Messages extends Component{
    constructor(socket, chat, mobile){
        super()
        this.messages    = document.querySelector('.active-list .message-list')
        this.messageBtn  = document.querySelector('.menu .message-list')
        this.chat        = chat
        this.socket      = socket
        this.totalUnread = 0
        this.mobile      = mobile
    }
    renderFirstMessage(room){
        if(this.messages.querySelector('p.info')){
            this.removeChilds(this.messages)
        }
        this.renderMessageListItem(room, 'afterbegin')
        document.getElementById(room.chatId).classList.add('active')
        this.chat.renderChat(room)
        this.messageBtn.click()
    }
    checkIfUnreadNeedUpdate(room){
        const chatEl = document.querySelector('.chat') 
        if(window.currentChatId && window.currentChatId === room.chatId){
            if(chatEl.classList.contains('hidden')){
                const info = document.querySelector('.main-nav .info')

                this.updateUnreadOfChat(room)
                this.updateTotalUnread(room)

                if(info.querySelector('.unread')){
                    info.querySelector('.unread').textContent = `(${this.unread(room.messages).length})`
                }else{
                    const unreadInInfo = this.create('span.unread').txt(`(${this.unread(room.messages).length})`).el
                    info.appendChild(unreadInInfo)
                }
            }else{

            }
        }
        this.updateUnreadOfChat(room)
        this.updateTotalUnread(room)
        
    }
    updateTotalUnread(){
        const unreadsEl = Array.from(this.messages.querySelectorAll('.unread'))
        const unreads   =  unreadsEl.length>0 && unreadsEl
            .map(u=>Number(u.textContent.trim()))
            .reduce((accumulator, currentValue) => accumulator + currentValue)
            
        if(unreads>0){
            this.messageBtn.querySelector('.newMatches').textContent = `(${unreads})`
        }else{
            this.messageBtn.querySelector('.newMatches').textContent = ''
        }
    }
    updateUnreadOfChat(room){
        const roomEl          = document.querySelector(`#${room.chatId}`)
        const unreadContainer = document.querySelector(`#${room.chatId} .unread`)
        const unreadLength = this.unread(room.messages).length
        
        if(unreadContainer){
            if(unreadLength === 0){
                roomEl.removeChild(unreadContainer)
            }else{
                unreadContainer.textContent = unreadLength
            }
        }else{
            if(unreadLength===0){
                return
            }
            const unread = this.create('div.unread').txt(unreadLength).el
            roomEl.appendChild(unread)
        }
    }
    updateChatRoomInList(room){
        console.log(room)
        const rooms      = Array.from(this.messages.querySelectorAll('li'))
        const roomIndex  = rooms.map(r=>r.id).indexOf(room.chatId)
        const roomEl     = document.getElementById(room.chatId)
        const userSended = room.messages[room.messages.length-1].userSended === 'you' 
            ? 'you' 
            : room.otherUser
        const displayMsg = `${userSended}: ${room.messages[room.messages.length-1].message}`

        if(!roomEl){
            this.renderMessageListItem(room, 'afterbegin')
            return
        }
        if(roomIndex===0){
            roomEl.querySelector('.message').textContent = displayMsg
            this.checkIfUnreadNeedUpdate(room)
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
                    this.checkIfUnreadNeedUpdate(room)
                })
            })
        }
    }
    renderMessageListItem(room, pos){
        const li     = this.create(`li#${room.chatId}.message`).el
        const pname  = this.create('p.name').txt(room.otherUser.name).el
        const sended = ()=> room.messages[room.messages.length-1].userSended === 'you' ? 'you' :  room.otherUser.name
        const pmsg   = this.create('p.message')
            .txt(room.messages.length === 0 
                ? 'Send your first message!' 
                : `${sended()}: ${room.messages[room.messages.length-1].message}`
            )
            .el
        const img    = this.create('img')
            .attr('src', room.otherUser.images.find(img=>img.mainPicture).url)
            .el
        const info   = this.create('div.info').el
        const unread = this.create('div.unread').txt(this.unread(room.messages).length).el
        
        this.appendChilds(info, [pname, pmsg])
        this.appendChilds(li, [img, info])

        this.unread(room.messages).length > 0 && li.appendChild(unread)
        this.totalUnread += this.unread(room.messages).length
        this.totalUnread > 0 
            ? document.querySelector('.message-list span').textContent = ` (${this.totalUnread})` 
            : null
        
        li.addEventListener('click',(e)=>{ 
            this.openChat.call(this,e)
            this.mobile && this.mobile.openMenu()
        })
        if(this.messages.querySelector('p.info')){
            this.messages.removeChild(this.messages.querySelector('p.info'))
        }
        this.messages.insertAdjacentElement(pos, li)
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
        this.updateTotalUnread()
        this.socket.emit('open chat', li.id)
    }
    initializeMessages(rooms){
        if(rooms.length===0 || !rooms)  return
        this.removeChilds(this.messages)
        rooms.forEach(room=>this.renderMessageListItem(room, 'beforeend'))
    }
}


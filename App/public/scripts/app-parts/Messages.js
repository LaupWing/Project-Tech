import Chat from './Chat.js'
export default class Messages{
    constructor(socket){
        this.messages   = document.querySelector('.active-list .message-list')
        this.messageBtn = document.querySelector('.menu .message-list')
        this.chat       = new Chat()
        this.socket     = socket
    }
    renderFirstMessage(room){
        this.messageBtn.click()
        if(this.messages.querySelector('p.info')){
            this.removeChilds()
        }
        this.renderMessageListItem(room)
        this.chat.renderChat(room)
    }
    openExistingChat(room){
        this.messageBtn.click()
        const messageEl = document.getElementById(room.chatId)
        messageEl.classList.add('active')
        console.log(messageEls)
    }
    renderMessageListItem(room){
        const li    = document.createElement('li')
        const pname = document.createElement('p')
        const pmsg  = document.createElement('p')
        const img   = document.createElement('img')
        const info  = document.createElement('div')

        li.id           = room.chatId
        info.className  = 'info'
        li.className    = 'message'
        pname.className = 'name'
        pmsg.className  = 'message'
        img.src         = room.otherUser.images.find(img=>img.mainPicture).url

        pname.textContent = room.otherUser.name
        pmsg.textContent  = room.messages.length === 0 ? 'Send your first message!' : 'msg'

        info.appendChild(pname)
        info.appendChild(pmsg)
        li.appendChild(img)
        li.appendChild(info)
        this.messages.insertAdjacentElement('afterbegin', li)
    }
    renderMessages(rooms){
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


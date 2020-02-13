export default class Messages{
    constructor(socket){
        this.messages = document.querySelector('.active-list .message-list')
        this.messageBtn = document.querySelector('.menu .message-list')
        this.socket   = socket
    }
    renderFirstMessage(room){
        this.messageBtn.click()
        this.renderChatEl(room)
    }
    renderChatEl(room){
        const li    = document.createElement('li')
        const pname = document.createElement('p')
        const pmsg  = document.createElement('p')
        const img   = document.createElement('img')
        const info  = document.createElement('div')
        
        li.id           = room.chatId
        info.className  = 'info'
        li.className    = room.messages.length > 0 ?  'match' : 'match not-opened'
        pname.className = 'name'
        pmsg.className  = 'message'
        img.src         = room.userProfilePic.url

        pname.textContent = room.name
        pmsg.textContent  = room.messages.length === 0 ? 'Send your first message!' : 'msg'

        info.appendChild(pname)
        info.appendChild(pmsg)
        li.appendChild(img)
        li.appendChild(info)
        this.messages.insertAdjacentElement('afterbegin', li)
    }
    renderMessages(rooms){
        const filterOut = rooms.filter(room=>room.messages.length!==0)
        if(filterOut.length ===0)   return
        this.removeChilds()
    }
    removeChilds(){
        const parent = this.messages
        while (parent.firstChild) {
            parent.firstChild.remove()
        }
    }
}


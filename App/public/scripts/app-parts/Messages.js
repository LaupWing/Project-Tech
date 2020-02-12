export default class Messages{
    constructor(socket){
        this.messages = document.querySelector('.active-list .message-list')
        this.messageBtn = document.querySelector('.menu .message-list')
        this.socket   = socket
    }
    renderStarterMessage(room){
        console.log(room)
        this.messageBtn.click()
    }
    renderChatEl(){
        const li    = document.createElement('li')
        const pname = document.createElement('p')
        const pmsg  = document.createElement('p')
        const img   = document.createElement('img')
        const info  = document.createElement('div')
        
        li.id = match.id
        info.className  = 'info'
        li.className    = match.clicked ?  'match' : 'match not-opened'
        pname.className = 'name'
        pmsg.className  = 'message'
        img.src         = match.images.find(img=>img.mainPicture).url

        pname.textContent = match.name
        pmsg.textContent  = !match.clicked ? 'You got a new match!' : 'Click for more info'

        info.appendChild(pname)
        info.appendChild(pmsg)
        li.appendChild(img)
        li.appendChild(info)
        li.addEventListener('click', this.cb)
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


export default class Chat{
    constructor(socket){
        this.detailPanel = document.querySelector('#info')
        this.id          = null
        this.socket      = socket
    }
    renderChat(room){
        this.removeChilds()
        const h2     = document.createElement('h2')
        const h2text = document.createTextNode(room.otherUser.name + ` (${room.otherUser.age})`)
        const button = document.createElement('button')
        const img    = document.createElement('img')
        const input  = document.createElement('input')
        const form   = document.createElement('form')
        const main   = document.createElement('main')
        this.id      = room.chatId
        
        img.src                = room.otherUser.images.find(x=>x.mainPicture).url
        h2.appendChild(img)
        h2.appendChild(h2text)
        input.type             = 'text'
        button.type            = 'submit'
        button.textContent     = 'SEND'
        form.appendChild(input)
        form.appendChild(button)
        form.addEventListener('submit', this.onSubmit.bind(this))

        this.detailPanel.classList.remove('user-detail')
        this.detailPanel.classList.add('chat')
        this.detailPanel.appendChild(h2)
        this.detailPanel.appendChild(main)
        setTimeout(()=>{
            this.detailPanel.appendChild(form)
            input.focus()
        },500)
        this.renderMessages(room.messages)
    }
    renderMessages(messages){
        if(messages.length>0){
            const msgContainer = this.detailPanel.querySelector('main')
            messages.forEach(msg=>{
                const p       = document.createElement('p')
                p.textContent = msg.message
                p.className   = msg.userSended
                msgContainer.insertAdjacentElement('afterbegin', p) 
            })
        }
    }
    onSubmit(e){
        e.preventDefault()
        const input = e.target.querySelector('input')
        if(input.value ==='')   return alert('You need to type something in')
        this.socket.emit('send message', {
            message   : input.value,
            chatId    : this.id,
            timestamp : new Date()
        })
        input.value = ''
    }
    removeChilds(){
        const parent = this.detailPanel
        while (parent.firstChild) {
            parent.firstChild.remove()
        }
    }
}
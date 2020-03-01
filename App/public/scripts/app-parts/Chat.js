import Component from './utils/component.js'
export default class Chat extends Component{
    constructor(socket){
        super()
        this.detailPanel = document.querySelector('#info')
        this.messageBtn  = document.querySelector('.menu .message-list')
        this.id          = null
        this.socket      = socket
    }
    renderChat(room){
        this.removeChilds(this.detailPanel)
        const h2     = this.create('h2').el
        const h2text = document.createTextNode(room.otherUser.name + ` (${room.otherUser.age})`)
        const button = this.create('button').txt('SEND').attr('type', 'submit').el
        const img    = this.create('img').attr('src',room.otherUser.images.find(x=>x.mainPicture).url).el
        const input  = this.create('input').attr('type', 'text').el
        const form   = this.create('form').el
        const main   = this.create('main').el
        this.id      = room.chatId
        
        
        this.appendChilds(h2, [img, h2text])
        this.appendChilds(form, [input,button])
        form.addEventListener('submit', this.onSubmit.bind(this))
        form.addEventListener('animationend', this.scrollToBottom.bind(this))
        this.detailPanel.classList.remove('user-detail')
        this.detailPanel.classList.add('chat')
        this.appendChilds(this.detailPanel, [h2,main])
        
        setTimeout(()=>{
            this.detailPanel.appendChild(form)
            input.focus()
        },500)
        this.renderMessages(room.messages)
    }
    openExistingChat(room){
        const messageEl = document.getElementById(room.chatId)
        this.renderChat(room)
        messageEl.classList.add('active')
        this.messageBtn.click()
    }
    renderMessages(messages){
        if(messages.length>0){
            const msgContainer = this.detailPanel.querySelector('main')
            messages.forEach(msg=>{
                const p = this.create(`p.${msg.userSended}`).txt(msg.message).el
                msgContainer.insertAdjacentElement('beforeend', p) 
            })
            this.scrollToBottom()
        }
    }
    addMessage(msg){
        const msgContainer = this.detailPanel.querySelector('main')
        if(this.id === msg.chatId){
            const p = this.create(`p.${msg.type}.new-message`).txt(msg.message).el
            msgContainer.insertAdjacentElement('beforeend', p) 
            this.scrollToBottom()
            return
        }
    }
    scrollToBottom(){
        const msgContainer = this.detailPanel.querySelector('main')
        msgContainer.scrollTop = msgContainer.scrollHeight
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
}
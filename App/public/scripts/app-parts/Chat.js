export default class Chat{
    constructor(){
        this.detailPanel = document.querySelector('#info')
        this.id          = null
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

        this.detailPanel.classList.remove('user-detail')
        this.detailPanel.classList.add('chat')
        this.detailPanel.appendChild(h2)
        this.detailPanel.appendChild(main)
        this.detailPanel.appendChild(form)
    }
    removeChilds(){
        const parent = this.detailPanel
        while (parent.firstChild) {
            parent.firstChild.remove()
        }
    }
}
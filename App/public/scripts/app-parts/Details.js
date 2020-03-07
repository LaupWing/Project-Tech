import Component from './utils/component.js'
export default class Details extends Component{
    constructor(socket){
        super()
        this.mainNav     = document.querySelector('.main-nav')
        this.panels      = document.querySelectorAll('.card-container > div')
        this.detailPanel = document.querySelector('#info')
        this.detailPanel.style.transition = 'all .5s'
        this.socket      = socket
        this.id          = null
    }
    gotUserDetail(user){
        this.setActiveLinkAndPanel()
        this.renderDetail(user)
    }
    setActiveLinkAndPanel(){
        this.mainNav.querySelectorAll('li').forEach(li=>li.classList.remove('active'))
        this.mainNav.querySelector('.info').classList.add('active')
        
        this.panels.forEach(panel=>panel.classList.remove('hidden'))
        document.querySelector('#matching').classList.add('hidden')
    }
    renderDetail(user){
        this.removeChilds(this.detailPanel)
        const h2         = document.createElement('h2')
        const pGender    = document.createElement('p')
        const spanGender = document.createElement('span')
        const pAge       = document.createElement('p')
        const spanAge    = document.createElement('span')
        const button     = document.createElement('button')
        const img        = document.createElement('img')
        this.id          = user.id

        img.src                = user.images.find(img=>img.mainPicture).url
        h2.textContent         = user.name
        pAge.textContent       = 'Age '
        pGender.textContent    = 'Gender '
        spanAge.textContent    = user.age
        spanGender.textContent = user.gender
        pAge.appendChild(spanAge)
        pGender.appendChild(spanGender)
        button.addEventListener('click', this.sendMessageClick.bind(this))
        
        button.textContent = 'Send a message!'
        this.detailPanel.classList.remove('chat')
        this.detailPanel.classList.add('user-detail')
        this.detailPanel.appendChild(h2)
        this.detailPanel.appendChild(img)
        this.detailPanel.appendChild(pAge)
        this.detailPanel.appendChild(pGender)
        this.detailPanel.appendChild(button)
    }
    sendMessageClick(){
        this.socket.emit('check messages', this.id)
    }
}
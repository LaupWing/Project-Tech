import Component from '../utils/component.js'
import Hearth from '../SVGstrings/hearth.js'
import Chat from '../SVGstrings/chat.js'
export default class extends Component{
    constructor(socket){
        super()
        this.socket = socket
        this.body   = document.body
        this.nav    = document.querySelector('nav') 
        this.menu
        this.renderMenu()
        this.socketListeners()
        this.nav.classList.add('hide')
        setTimeout(()=>{
            this.nav.style.transition = 'all 1s'
        })
    }
    socketListeners(){
        this.socket.on('send matchesList',     mobile.setInfo.bind(mobile, 'hearth'))
        this.socket.on('initialize chatrooms', (chatObj)=>{
            const unreadMsgs = chatObj
                .reduce((acc, val) => acc.concat(val.messages), []) 
                .filter(msg=>msg.userSended === 'otherUser')
            mobile.setInfo.call(mobile, 'chat', unreadMsgs)
        })
        this.socket.on('update chatroom in list', (chatObj)=>{
            mobile.setInfo.call(mobile,'chat', chatObj.messages)
        })
    }
    renderMenu(){
        const mobileMenu    = this.create('div.menu-mobile').el
        const backdrop      = this.create('div.backdrop').el
        const h2            = this.create('h2').txt('Menu').el
        const svgContainer  = this.create('div.svg-container').el
        const svgContainer2 = this.create('div.svg-container').el
        
        svgContainer.insertAdjacentHTML('beforeend', Hearth)
        svgContainer.classList.add('hearth')
        
        svgContainer2.insertAdjacentHTML('beforeend', Chat)
        svgContainer2.classList.add('chat')
        
        this.appendChilds(mobileMenu, [svgContainer, h2, svgContainer2])
        this.appendChilds(this.body, [mobileMenu, backdrop])
        
        this.menu = mobileMenu
        this.menu.querySelector('h2').addEventListener('click', this.openMenu.bind(this))
        svgContainer.querySelector('svg').addEventListener('click', this.openSection.bind(this,'match-list'))
        svgContainer2.querySelector('svg').addEventListener('click', this.openSection.bind(this,'message-list'))
    }
    openSection(section){
        if(this.nav.classList.contains('hide')){
            this.openMenu()
        }
        document.querySelector(`nav .menu .${section}`).click()
    }
    openMenu(){
        this.nav.classList.toggle('hide')
        if(this.nav.classList.contains('hide')){
            this.menu.querySelector('h2').classList.remove('active')
        }else{
            this.menu.querySelector('h2').classList.add('active')
        }
    }
    setInfo(type, data){
        const container = document.querySelector(`.menu-mobile .${type}`)
        const filtered  = data
            .filter(item=>{
                return type === 'chat' ? !item.read : !item.clicked
            })
        console.log(type, data)
        if(filtered.length>0){
            if(container.querySelector('.info')){
                container.querySelector('.info').textContent = filtered.length
                return
            }
            container.querySelector('svg').classList.add('active')
            const infoEl = this.create('div.info').txt(filtered.length).el
            container.insertAdjacentElement('beforeend', infoEl)
        }else{
            container.querySelector('svg').classList.contains('active') && 
            container.querySelector('svg').classList.remove('active')

            container.querySelector('.info') &&
            container.removeChild(container.querySelector('.info'))
        }
    }
}
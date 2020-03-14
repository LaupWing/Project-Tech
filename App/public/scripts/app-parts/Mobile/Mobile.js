import Component from '../utils/component.js'
import Hearth from '../SVGstrings/hearth.js'
import Chat from '../SVGstrings/chat.js'
export default class extends Component{
    constructor(){
        super()
        this.body = document.body
        this.nav  = document.querySelector('nav') 
        this.menu
        this.renderMenu()
        this.nav.classList.add('hide')
        setTimeout(()=>{
            this.nav.style.transition = 'all 1s'
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
    }
    openMenu(){
        this.nav.classList.toggle('hide')
        if(this.nav.classList.contains('hide')){
            this.menu.querySelector('h2').classList.remove('active')
        }else{
            this.menu.querySelector('h2').classList.add('active')
        }
    }
}
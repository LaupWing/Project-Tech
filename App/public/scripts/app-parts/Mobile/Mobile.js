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
        const mobileMenu = this.create('div.menu-mobile').el
        const backdrop   = this.create('div.backdrop').el

        this.insertRawHTMLText(mobileMenu, [Hearth, '<h2>Menu</h2>', Chat])
        this.appendChilds(this.body, [mobileMenu, backdrop])

        this.menu = mobileMenu
        console.log(this.menu)
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
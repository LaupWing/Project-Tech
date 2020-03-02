import Component from '../utils/component.js'
import Hearth from '../SVGstrings/hearth.js'
import Chat from '../SVGstrings/chat.js'
export default class extends Component{
    constructor(){
        super()
        this.body = document.body
        this.renderMenu()
    }
    renderMenu(){
        const mobileMenu = this.create('div.menu-mobile').el
        const backdrop   = this.create('div.backdrop').el

        this.insertRawHTMLText(mobileMenu, [Hearth, '<h2>Menu</h2>', Chat])
        this.appendChilds(this.body, [mobileMenu, backdrop])
    }
}
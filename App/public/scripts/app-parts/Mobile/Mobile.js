import Component from '../utils/component.js'

export default class extends Component{
    constructor(){
        super()
        this.body = document.body
        this.renderMenu()
    }
    renderMenu(){
        console.log('rendering')
        const mobileMenu = this.create('div.menu-mobile').el
        const bar1       = this.create('div.bar1').el
        const bar2       = this.create('div.bar2').el
        const bar3       = this.create('div.bar3').el

        this.appendChilds(mobileMenu, [bar1, bar2, bar3])
        this.appendChilds(this.body, [mobileMenu])
    }
}
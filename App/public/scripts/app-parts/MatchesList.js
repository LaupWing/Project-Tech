import Component from './utils/component.js'
export default class MatchesList extends Component{
    constructor(eventFunction, mobile){
        super()
        this.matchesList     = document.querySelector('.active-list .match-list')
        this.totalNewmatches = document.querySelector('.newMatches')
        this.cb              = eventFunction
        this.mobile          = mobile
    }
    renderList(list){
        if(list.length===0) return
        this.removeChilds(this.matchesList)
        list.forEach(match=>{
            const li    = this.create(`li#${match.id}.${match.clicked ? 'match' : 'match.not-opened'}`).el
            const pname = this.create('p.name').txt(match.name).el
            const pmsg  = this.create('p.message').txt(!match.clicked ? 'You got a new match!' : 'Click for more info').el
            const img   = this.create('img').attr('src', match.images.find(img=>img.mainPicture).url).el
            const info  = this.create('div.info').el

            this.appendChilds(info, [pname, pmsg])
            this.appendChilds(li, [img,info])
            
            li.addEventListener('click',(e)=>{ 
                this.cb.call(this,e)
                this.mobile && this.mobile.openMenu()
            })
            this.matchesList.insertAdjacentElement('afterbegin', li)
        })
        const newMatchesLength = list.filter(match=>!match.clicked).length
        this.totalNewmatches.textContent = newMatchesLength !== 0 ? ` (${newMatchesLength})` : ''
    }
}
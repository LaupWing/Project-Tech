export default class MatchesList{
    constructor(eventFunction){
        this.matchesList = document.querySelector('.active-list .match-list')
        this.totalNewmatches = document.querySelector('.newMatches')
        this.cb = eventFunction
    }
    renderList(list){
        if(list.length===0) return
        this.removeChilds()
        list.forEach(match=>{
            const li    = document.createElement('li')
            const pname = document.createElement('p')
            const pmsg  = document.createElement('p')
            const img   = document.createElement('img')
            const info  = document.createElement('div')
            
            li.id = match.id
            info.className  = 'info'
            li.className    = match.clicked ?  'match' : 'match not-opened'
            pname.className = 'name'
            pmsg.className  = 'message'
            img.src         = match.images.find(img=>img.mainPicture).url

            pname.textContent = match.name
            pmsg.textContent  = !match.clicked ? 'You got a new match!' : 'Click for more info'

            info.appendChild(pname)
            info.appendChild(pmsg)
            li.appendChild(img)
            li.appendChild(info)
            li.addEventListener('click', this.cb)
            this.matchesList.insertAdjacentElement('afterbegin', li)
        })
        const newMatchesLength = list.filter(match=>!match.clicked).length
        this.totalNewmatches.textContent = newMatchesLength !== 0 ? ` (${newMatchesLength})` : ''
    }
    removeChilds(){
        const parent = this.matchesList
        while (parent.firstChild) {
            parent.firstChild.remove()
        }
    }
}
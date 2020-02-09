const socket = io()
import Matching from './app-parts/Matching.js'
import MatchesList from './app-parts/MatchesList.js'
import Details from './app-parts/Details.js'

class switchPanel{
    constructor(){
        this.mainNav = document.querySelector('.main-nav')
        this.cardContainer = document.querySelector('.card-container')
        this.panels = document.querySelectorAll('.card-container > div')

        this.items = this.mainNav.querySelectorAll('li')
        this.items.forEach(item=>item.addEventListener('click', this.switch.bind(this)))
    }

    switch(event){
        const panel = event.target.classList[0]

        this.items.forEach(item=>item.classList.remove('active'))
        event.target.classList.add('active')
        this.panels.forEach(p=>{
            if(p.id !== panel){
                p.classList.add('hidden')
            }else{
                p.classList.remove('hidden')
            }
        })
    }
}

const init = ()=>{
    const matches = new Matching()
    const matchesList = new MatchesList((e)=>socket.emit('show detail', e.target.id))
    const details = new Details()
    new switchPanel()

    // Sockets
    socket.emit('get match')
    socket.on('sending match', matches.renderMatch.bind(matches))
    socket.on('send matchesList', matchesList.renderList.bind(matchesList))
    socket.on('user detail', details.gotUserDetail.bind(details))
}

init()
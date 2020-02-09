const socket = io()
import Matching from './app-parts/Matching.js'
import MatchesList from './app-parts/MatchesList.js'

class showDetails{
    constructor(){
        socket.on('user detail', this.gotUserDetail.bind(this))
        this.mainNav = document.querySelector('.main-nav')
        this.panels = document.querySelectorAll('.card-container > div')
        this.detailPanel = document.querySelector('#info')
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
        const h2 = this.detailPanel.querySelector('h2')
        const gender = this.detailPanel.querySelector('.gender')
        const age = this.detailPanel.querySelector('.age')
        const img = this.detailPanel.querySelector('img')
        
        img.src = user.images.find(img=>img.mainPicture).url
        h2.textContent = user.name
        age.textContent = user.age
        gender.textContent = user.gender
        
    }
}

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
        console.log(document.querySelector(`#${panel}`))
    }
}

const init = ()=>{
    const matches = new Matching()
    const matchesList = new MatchesList((e)=>{
        console.log(e.target.id)
        socket.emit('show detail', e.target.id)
    })
    new showDetails()
    new switchPanel()

    // Sockets
    socket.emit('get match')
    socket.on('sending match', matches.renderMatch.bind(matches))
    socket.on('send matchesList', matchesList.renderList.bind(matchesList))
}

init()
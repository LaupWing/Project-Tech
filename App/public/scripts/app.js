const socket = io()

class getMatch{
    constructor(){
        socket.removeAllListeners()
        socket.emit('get match')
        socket.on('sending match', this.renderMatch.bind(this))
        this.card = document.getElementById("card");
        this.card.querySelector('button.yes').addEventListener('click', this.accepted.bind(this))
        this.card.querySelector('button.no').addEventListener('click', this.denied.bind(this))
    }
    renderMatch(person){
        const h2 = this.card.querySelector('h2')
        const age = this.card.querySelector('.age')
        const gender = this.card.querySelector('.gender')
        h2.textContent = person.name
        age.textContent = person.age
        gender.textContent = person.gender
        this.card.style.setProperty('--profile',`url(${person.images.find(i=>i.mainPicture).url})`)
    }
    denied(){
        if(this.card.querySelector('.age').textContent === 'infinite')  return alert('NOBODY WANTS YOU')
        socket.emit('denied match')
    }
    accepted(){
        if(this.card.querySelector('.age').textContent === 'infinite')  return alert('NOBODY WANTS YOU')
        socket.emit('accepted match')
    }
}

class checkMatches{
    constructor(){
        socket.on('send matchesList', this.renderList.bind(this))
        this.matchesList = document.querySelector('.active-list')
    }
    renderList(list){
        this.removeChilds()
        list.forEach(match=>{
            const li = document.createElement('li')
            const pname = document.createElement('p')
            const pmsg = document.createElement('p')
            li.className  = match.clicked ?  'match not-opened' : 'match'
            pname.className  = 'name'
            pmsg.className  = 'message'

            pname.textContent = match.name
            pmsg.textContent = match.clicked ? 'You got a new match!' : 'Click for more info'

            li.appendChild(pname)
            li.appendChild(pmsg)

            this.matchesList.insertAdjacentElement('afterbegin', li)

        })
    }
    removeChilds(){
        const parent = this.matchesList
        while (parent.firstChild) {
            parent.firstChild.remove()
        }
    }
}

const init = ()=>{
    new getMatch()
    new checkMatches()
}

init()
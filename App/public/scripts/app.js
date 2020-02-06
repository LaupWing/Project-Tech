const socket = io()

class getMatch{
    constructor(){
        socket.emit('get match')
        socket.on('sending match', this.renderMatch.bind(this))
        this.card = document.getElementById("card");
        this.card.querySelector('button.yes').addEventListener('click', this.accepted)
        this.card.querySelector('button.no').addEventListener('click', this.denied)
    }
    renderMatch(person){
        const h2 = this.card.querySelector('h2')
        const age = this.card.querySelector('.age')
        h2.textContent = person.name
        age.textContent = person.age
        this.card.style.setProperty('--profile',`url(${person.images.find(i=>i.mainPicture).url})`)
    }
    denied(){
        socket.emit('denied match')
    }
    accepted(){
        socket.emit('accepted match')
    }
}

const init = ()=>{
    new getMatch()
}

init()
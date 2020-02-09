export default class Matches{
    constructor(socket){
        this.card = document.getElementById("matching")
        this.card.querySelector('button.yes').addEventListener('click', this.accepted.bind(this))
        this.card.querySelector('button.no').addEventListener('click', this.denied.bind(this))
        this.socket = socket
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
        if(this.card.querySelector('.age').textContent === 'infinite')  return alert('FOR MY OWN')
        this.socket.emit('denied match')
    }
    accepted(){
        if(this.card.querySelector('.age').textContent === 'infinite')  return alert('FOR MY OWN')
        this.socket.emit('accepted match')
    }
}
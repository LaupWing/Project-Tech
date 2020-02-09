export default class Matches{
    constructor(){
        this.card = document.getElementById("matching");
        console.log(this.card)
        this.card.querySelector('button.yes').addEventListener('click', this.accepted.bind(this))
        this.card.querySelector('button.no').addEventListener('click', this.denied.bind(this))
    }
    renderMatch(person){
        console.log(this)
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
        socket.emit('denied match')
    }
    accepted(){
        if(this.card.querySelector('.age').textContent === 'infinite')  return alert('FOR MY OWN')
        socket.emit('accepted match')
    }
}
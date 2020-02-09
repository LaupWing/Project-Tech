export default class Matches{
    constructor(socket){
        this.matching = document.getElementById("matching")
        this.matching.querySelector('button.yes').addEventListener('click', this.accepted.bind(this))
        this.matching.querySelector('button.no').addEventListener('click', this.denied.bind(this))
        this.socket = socket
        this.init = true
        this.action = null
    }
    renderMatch(person){
        const h2 = this.matching.querySelector('h2')
        const age = this.matching.querySelector('.age')
        const gender = this.matching.querySelector('.gender')

        h2.textContent = person.name
        age.textContent = person.age
        gender.textContent = person.gender
        this.matching.style.setProperty('--profile',`url(${person.images.find(i=>i.mainPicture).url})`)
        console.log(this.init)
        if(!this.init){
            const transitionEnded = ()=>{
                this.matching.style.removeProperty('transitionDelay')
                this.matching.style.removeProperty('transition')
                this.matching.removeEventListener('transitionend', transitionEnded)
            }
            this.matching.addEventListener('transitionend', transitionEnded)
            this.matching.style.transition = '1s opacity'
            this.matching.style.transitionDelay = '.2s'
            this.matching.classList.remove('accepted')
            this.matching.classList.remove('denied')
        }else{
            this.init = false
        }
    }
    denied(){
        if(this.matching.querySelector('.age').textContent === 'infinite')  return alert('FOR MY OWN')
        this.matching.classList.add('denied')
        this.matching.addEventListener('transitionend', this.showNewMatch.bind(this))
    }
    accepted(){
        if(this.matching.querySelector('.age').textContent === 'infinite')  return alert('FOR MY OWN')
        this.matching.classList.add('accepted')
        this.matching.addEventListener('transitionend', this.showNewMatch.bind(this))
    }
    showNewMatch(e){
        if(e.propertyName === 'opacity'){
            this.matching.removeEventListener('transitionend', this.showNewMatch)
            console.log(e.target.classList[0])
            if(e.target.classList[0]==='accepted'){
                this.socket.emit('accepted match')
            }else if(e.target.classList[0]==='denied'){
                this.socket.emit('denied match')
            }
        }
    }
}
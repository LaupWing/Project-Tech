const socket = io()

class getMatch{
    constructor(){
        socket.emit('get match')
        socket.on('sending match', this.renderMatch)
    }
    renderMatch(person){
        const card = document.getElementById("card");
        const h2 = card.querySelector('h2')
        const age = card.querySelector('.age')
        h2.textContent = person.name
        age.textContent = person.age
        card.style.setProperty('--profile',`url(${person.images.find(i=>i.mainPicture).url})`);
    }
}

const init = ()=>{
    new getMatch()
}

init()
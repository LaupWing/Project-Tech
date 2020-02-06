const socket = io()

class getMatch{
    constructor(){
        socket.emit('get match')
        socket.on('sending match', this.renderMatch)
    }
    renderMatch(person){
        const card = document.getElementById("card");
        while (card.firstChild) {
            card.firstChild.remove();
        }
        const img = document.createElement('img')
        img.src = person.images.find(i=>i.mainPicture).url
        card.appendChild(img)
    }
}

const init = ()=>{
    new getMatch()
}

init()
const socket = io()

class getMatch{
    constructor(){
        socket.emit('get match')
        socket.on('sending match', this.renderMatch)
    }
    renderMatch(person){
        console.log(person)
    }
}

const init = ()=>{
    new getMatch()
}

init()
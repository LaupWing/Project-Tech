export default class Messages{
    constructor(socket){
        this.messages = document.querySelector('.active-list .message-list')
        this.socket   = socket
    }
    renderStarterMessage(room){
        console.log(room)
    }
    renderMessages(rooms){
        const filterOut = rooms.filter(room=>room.messages.length!==0)
        if(filterOut.length ===0)   return
        this.removeChilds()
    }
    removeChilds(){
        const parent = this.messages
        while (parent.firstChild) {
            parent.firstChild.remove()
        }
    }
}


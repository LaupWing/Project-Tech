class logoutBtn{
    constructor(){
        this.button = document.querySelector('li.logout-btn')
        this.button.addEventListener('click', this.loggingout.bind(this))
    }
    loggingout(e){
        fetch('http://localhost:3000/logout', {
            method: 'POST'
        })
    }
}

const init = ()=>{
    new logoutBtn()
}

init()
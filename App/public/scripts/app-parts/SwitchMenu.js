export default class SwitchMenu{
    constructor(){
        this.messagesList = document.querySelector('.menu .message-list')
        this.matchesList = document.querySelector('.menu .match-list')
        this.menus = document.querySelectorAll('.active-list > div')
        this.messagesList.addEventListener('click', this.switchMenu.bind(this))
        this.matchesList.addEventListener('click', this.switchMenu.bind(this))
    }
    switchMenu(e){
        const active = e.target.classList
        console.log(active)
    }
} 
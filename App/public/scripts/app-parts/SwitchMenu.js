export default class SwitchMenu{
    constructor(){
        this.messagesList = document.querySelector('.menu .messagesList')
        this.matchesList = document.querySelector('.menu .matchesList')

        this.messagesList.addEventListener('click', this.switchMenu)
        this.matchesList.addEventListener('click', this.switchMenu)
    }
    switchMenu(){
        console.log(this)
    }
} 
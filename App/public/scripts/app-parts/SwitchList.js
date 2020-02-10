export default class SwitchList{
    constructor(){
        this.messagesList = document.querySelector('.menu .message-list')
        this.matchesList = document.querySelector('.menu .match-list')
        this.menus = document.querySelectorAll('.active-list > div')

        this.messagesList.addEventListener('click', this.switchMenu.bind(this))
        this.matchesList.addEventListener('click', this.switchMenu.bind(this))
    }
    switchMenu(e){
        this.messagesList.classList.remove('active')
        this.matchesList.classList.remove('active')

        e.target.closest('li').classList.add('active')
        const active = e.target.closest('li').classList[0]
        this.menus.forEach(menu=>{
            if(menu.classList[0]===active){
                return menu.classList.remove('hidden')
            }
            menu.classList.add('hidden')
        })
    }
} 
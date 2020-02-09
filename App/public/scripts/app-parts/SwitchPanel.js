export default class SwitchPanel{
    constructor(){
        this.mainNav = document.querySelector('.main-nav')
        this.cardContainer = document.querySelector('.card-container')
        
        this.items = this.mainNav.querySelectorAll('li')
        this.items.forEach(item=>item.addEventListener('click', this.switch.bind(this)))
    }
    
    switch(event){
        const panel = event.target.classList[0]
        const panels = document.querySelectorAll('.card-container > div')

        this.items.forEach(item=>item.classList.remove('active'))
        event.target.classList.add('active')
        panels.forEach(p=>{
            if(p.id !== panel){
                p.classList.add('hidden')
            }else{
                p.classList.remove('hidden')
            }
        })
    }
}
export default class Details{
    constructor(){
        this.mainNav = document.querySelector('.main-nav')
        this.panels = document.querySelectorAll('.card-container > div')
        this.detailPanel = document.querySelector('#info')
    }
    gotUserDetail(user){
        this.setActiveLinkAndPanel()
        this.renderDetail(user)
    }
    setActiveLinkAndPanel(){
        this.mainNav.querySelectorAll('li').forEach(li=>li.classList.remove('active'))
        this.mainNav.querySelector('.info').classList.add('active')
        
        this.panels.forEach(panel=>panel.classList.remove('hidden'))
        document.querySelector('#matching').classList.add('hidden')
    }
    renderDetail(user){
        const h2 = this.detailPanel.querySelector('h2')
        const gender = this.detailPanel.querySelector('.gender')
        const age = this.detailPanel.querySelector('.age')
        const img = this.detailPanel.querySelector('img')
        
        img.src = user.images.find(img=>img.mainPicture).url
        h2.textContent = user.name
        age.textContent = user.age
        gender.textContent = user.gender
    }
}
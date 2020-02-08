console.log('signuppage')
// Todo!!!!!!!!!!!!!
// When user changes his/her age the slides automatic changes
class imageLoader{
    constructor(){
        this.input = document.querySelector('input[type="file"]')
        this.input.addEventListener('change',()=> this.readFile(this))
    }
    readFile(input){
        if(input.input.files && input.input.files[0]){
            const reader = new FileReader()
            reader.onload = function (e){
                document.querySelector('img').src = e.target.result
            }
            reader.readAsDataURL(input.input.files[0]);
        }
    }
}

class nextSection{
    constructor(){
        this.nextBtn = document.querySelector('button.next')
        this.backBtn = document.querySelector('button.back')
        this.currentStep = document.querySelector('h2 span')

        this.nextBtn.addEventListener('click', this.next.bind(this))
        this.backBtn.addEventListener('click', this.back.bind(this))
    }
    next(){
        const done = document.querySelectorAll('.done')
        const fields = document.querySelectorAll('.field')
        const ended = ()=>{
            fields[done.length+1].classList.add('visible')
            fields[done.length].removeEventListener('transitionend', ended)
            this.updateCurrent()
        }

        fields[done.length].addEventListener('transitionend', ended)
        fields[done.length].classList.add('done')
    }
    back(){
        const done = document.querySelectorAll('.done')
        const fields = document.querySelectorAll('.field')
        const ended = ()=>{
            fields[done.length-1].classList.remove('done')
            fields[done.length].removeEventListener('transitionend', ended)
            this.updateCurrent()
        }
        if(done.length === 0){
            return
        }
        fields[done.length].addEventListener('transitionend', ended)
        fields[done.length].classList.remove('visible')
    }
    updateCurrent(){
        const done = document.querySelectorAll('.done')
        this.currentStep.textContent = ` ${done.length+1}/5`
    }
}

class slider{
    constructor(){
        this.minAge = document.querySelector('input[name="minAge"]')
        this.maxAge = document.querySelector('input[name="maxAge"]')

        this.minAge.addEventListener('input', this.changeVal)
        this.maxAge.addEventListener('input', this.changeVal)
    }
    changeVal(e){
        const display = e.target.parentElement.querySelector('p span')
        display.textContent = e.target.value
    }
}

const init = ()=>{
    new imageLoader()
    new nextSection()
    new slider()
}

init()
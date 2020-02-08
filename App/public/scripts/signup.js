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
        
        this.nextBtn.addEventListener('click', this.next)
        this.backBtn.addEventListener('click', this.back)
    }
    next(){
        const done = document.querySelectorAll('.done')
        const fields = document.querySelectorAll('.field')
        const ended = ()=>{
            fields[done.length+1].classList.add('visible')
            fields[done.length].removeEventListener('transitionend', ended)
        }

        fields[done.length].addEventListener('transitionend', ended)
        fields[done.length].classList.add('done')
    }
    back(){
        console.log('back')
    }
}

const init = ()=>{
    new imageLoader()
    new nextSection()
}

init()
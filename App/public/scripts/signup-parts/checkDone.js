export default class CheckDone{
    constructor(){
        this.stepsContainer  = document.querySelector('.progress')
        this.inputs          = document.querySelectorAll('input')
        this.inputs.forEach(input=>input.addEventListener('input', this.checkInput.bind(this))) 
    }
    checkInput(e){
        const el = this.stepsContainer.querySelector(`.${e.target.name}`)
    }
}
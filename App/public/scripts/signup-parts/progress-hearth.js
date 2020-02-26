export default class ProgressHearth{
    constructor(){
        this.stepsContainer  = document.querySelector('.progress')
        this.inputs          = document.querySelectorAll('input')
        this.inputs.forEach(input=>input.addEventListener('input', this.checkInput.bind(this))) 
    }
    checkInput(e){
        const el = this.stepsContainer.querySelector(`.${e.target.name}`)
        if(!el) return
        if(e.target.value !== '' && !el.classList.contains('done')){
            el.classList.add('done')
            const checkEveryDone = Array.from(el.closest('.step').querySelectorAll('p'))
                .every(p=>p.classList.contains('done'))
            if(checkEveryDone){
                el.closest('.step').querySelector('svg').classList.add('done')
            }
        }else if(e.target.value === ''){
            el.classList.remove('done')
            el.closest('.step').querySelector('svg').classList.remove('done')
        }
    }
}
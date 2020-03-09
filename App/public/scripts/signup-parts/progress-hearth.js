import Warning from './FieldCheck/Warning.js'

export default class ProgressHearth{
    constructor(){
        this.warning         = new Warning()
        this.stepsContainer  = document.querySelector('.progress')
        this.inputs          = document.querySelectorAll('input')
        this.steps           = document.querySelectorAll('.step')
        this.inputs.forEach(input=>input.addEventListener('input', this.checkInput.bind(this))) 
        this.steps.forEach(step=>step.addEventListener('click', this.checkWarning.bind(this))) 
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
    checkWarning(e){
        console.log(this.warning)
        this.warning.checkField(e)
    }
}
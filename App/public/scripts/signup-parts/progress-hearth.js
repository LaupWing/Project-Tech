import Warning from './FieldCheck/ProgressWarning.js'

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
        if(
            e.target.value !== '' && 
            this.extraCheck(e.target)
        ){
            const el = this.stepsContainer.querySelector(`.${e.target.name}`)
            el.classList.add('done')
            const checkEveryDone = Array.from(el.closest('.step').querySelectorAll('p'))
                .every(p=>p.classList.contains('done'))
            if(checkEveryDone){
                el.closest('.step').querySelector('svg').classList.add('done')
            }
        }else if(e.target.value === ''){
            const el = e.target.name !== 'passwordCheck'  
                ? this.stepsContainer.querySelector(`.${e.target.name}`)
                : this.stepsContainer.querySelector('.password')
                
            el.classList.remove('done')
            el.closest('.step').querySelector('svg').classList.remove('done')
            el.classList.remove('error')
            el.closest('.step').querySelector('svg').classList.remove('error')
        }
    }
    extraCheck(target){
        if(
            target.name === 'password'||
            target.name === 'passwordCheck'||
            target.name === 'maxAge'||
            target.name === 'minAge'
        ){
            if(target.name === 'password' || target.name === 'passwordCheck'){
                this.passwordCheck()
                return false
            }
            if(target.name === 'minAge' || target.name === 'maxAge'){
                this.agePreferenceCheck(target)
                return false
            }
        }
        return true
    }
    passwordCheck(){
        const svg           = document.querySelector('.steps-hearth .step.one svg')
        const passwordLabel = document.querySelector('.step .password')

        const password      = document.querySelector('form input[name="password"]')
        const passwordCheck = document.querySelector('form input[name="passwordCheck"]')
        
        if(password.value === '' || passwordCheck.value === ''){
            svg.classList.remove('error')
            passwordLabel.classList.remove('error')
        }
        else if(password.value !== passwordCheck.value){
            passwordLabel.classList.add('error')
            svg.classList.add('error')
        }else{
            svg.classList.remove('error')
            svg.classList.add('done')
            
            passwordLabel.classList.remove('error')
            passwordLabel.classList.add('done')
        }
    }
    agePreferenceCheck(target){
        console.log(target)
    }
    checkWarning(e){
        this.warning.checkField(e)
    }
}
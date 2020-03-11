import Warning     from './FieldCheck/ProgressWarning.js'
import {checkDone} from './utils/utils.js'

export default class ProgressHearth{
    constructor(){
        this.warning         = new Warning()
        this.stepsContainer  = document.querySelector('.progress')
        this.inputs          = document.querySelectorAll('input')
        this._svgs           = document.querySelectorAll('.step svg')
        this.steps           = document.querySelectorAll('.step')
        this._fields         = Array.from(document.querySelectorAll('.field'))
        checkDone(this._svgs)
        this._fields.forEach(field=>
            field.addEventListener('transitionend', checkDone.bind(this, this._svgs))
        )
        this.inputs.forEach(input=>input.addEventListener('input', this.checkInput.bind(this))) 
        this.steps.forEach(step=>step.addEventListener('click', this.checkWarning.bind(this))) 
        this._initValueChecks()
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
        const email         = document.querySelector('form input[name="email"]')
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
            if(email.value !== ''){
                svg.classList.add('done')
            }
            
            passwordLabel.classList.remove('error')
            passwordLabel.classList.add('done')
        }
    }
    agePreferenceCheck(){
        const minAge = document.querySelector('form input[name="minAge"]')
        const maxAge = document.querySelector('form input[name="maxAge"]')
        const svg    = document.querySelector('.steps-hearth .step.four svg')

        const minAgeLabel = document.querySelector('.step .minAge')

        if(minAge.value>maxAge.value){
            minAgeLabel.classList.add('error')
            svg.classList.add('error')
        }else if(minAgeLabel.classList.contains('error')){
            minAgeLabel.classList.remove('error')
            svg.classList.remove('error')
        }
    }
    checkWarning(e){
        this.warning.checkField(e)
    }
    _initValueChecks(){
        this.inputs.forEach(input=>{
            if(input.value !== ''){
                if(input.type === 'radio'){
                    if(!input.checked){
                        return
                    }
                }
                this.stepsContainer.querySelector(`.${input.name}`).classList.add('done')  
            }
        })
    }
}
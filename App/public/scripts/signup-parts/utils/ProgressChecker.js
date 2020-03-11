export default class ProgressChecker{
    constructor(type){
        this._type           = type
        this._bars           = Array.from(document.querySelectorAll('.bar'))
        this.stepsContainer  = document.querySelector('.progress')
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
                const indicator = this._type === 'mobile'
                    ?   (()=>{
                            const step = el.closest('.step')
                            const stepNumber = step.classList[1]
                            
                            return document.querySelector(`.bar.${stepNumber}`)
                        })() 
                    :   el.closest('.step').querySelector('svg')
                indicator.classList.add('done')
            }
        }else if(e.target.value === ''){
            const el = e.target.name !== 'passwordCheck'  
                ? this.stepsContainer.querySelector(`.${e.target.name}`)
                : this.stepsContainer.querySelector('.password')
            const indicator = this._type === 'mobile'
                ?   (()=>{
                        const step = el.closest('.step')
                        const stepNumber = step.classList[1]
                        
                        return document.querySelector(`.bar.${stepNumber}`)
                    })() 
                :   el.closest('.step').querySelector('svg')    

            el.classList.remove('done')
            el.classList.remove('error')
            
            indicator.classList.remove('done')
            indicator.classList.remove('error')
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
                this.agePreferenceCheck()
                return false
            }
        }
        return true
    }
    passwordCheck(){
        const indicator     = this._type === 'mobile'
            ?   document.querySelector('.steps-bar .bar.one')
            :   document.querySelector('.steps-hearth .step.one svg')
        const passwordLabel = document.querySelector('.step .password')

        const password      = document.querySelector('form input[name="password"]')
        const email         = document.querySelector('form input[name="email"]')
        const passwordCheck = document.querySelector('form input[name="passwordCheck"]')
        
        if(password.value === '' || passwordCheck.value === ''){
            indicator.classList.remove('error')
            passwordLabel.classList.remove('error')
        }
        else if(password.value !== passwordCheck.value){
            passwordLabel.classList.add('error')
            indicator.classList.add('error')
        }else{
            indicator.classList.remove('error')
            if(email.value !== ''){
                indicator.classList.add('done')
            }
            
            passwordLabel.classList.remove('error')
            passwordLabel.classList.add('done')
        }
    }
    agePreferenceCheck(){
        const minAge      = document.querySelector('form input[name="minAge"]')
        const maxAge      = document.querySelector('form input[name="maxAge"]')
        const genderPref  = Array.from(document.querySelectorAll('form input[name="gender_preference"]'))
        const indicator = this._type === 'mobile'
            ?   document.querySelector('.steps-bar .bar.four')
            :   document.querySelector('.steps-hearth .step.four svg')

        const minAgeLabel = document.querySelector('.step .minAge')

        if(minAge.value>maxAge.value){
            minAgeLabel.classList.add('error')
            indicator.classList.add('error')
        }else{
            minAgeLabel.classList.remove('error')
            indicator.classList.remove('error')
            console.log('else')
            if(
                maxAge.value !== '' &&
                minAge.value !== '' &&
                genderPref.some(pref=>pref.checked)
            ){
                indicator.classList.add('done')
            }
        }
    }
}
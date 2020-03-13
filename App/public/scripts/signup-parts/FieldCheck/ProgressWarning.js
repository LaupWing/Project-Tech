export default class ProgressWarning {
    constructor(){
        this._fields = Array.from(document.querySelectorAll('form .field'))
        this._modal  = document.querySelector('laup-modal') 
        this._steps  = document.querySelectorAll('.step')
    }
    checkField(el){
        const field       = el
        const indexField  = Array.from(this._steps).findIndex(x=>x===field)
        const inputFields = document.querySelectorAll('form .field')
        const inputField  = inputFields[indexField]
        
        switch(indexField) {
            case 0:
                this._inlogInfo(inputField)
                break
            case 1:
                this._generalInfo(inputField)
                break
            case 2:
                this._photo(inputField)
                break
            case 3:
                this._preference(inputField)
                break
            default: return
          }
    }
    _empty(field){
        const inputs = Array.from(field.querySelectorAll('input'))
        const empty  = inputs.some(input => {
            if(input.type === 'radio'){
                const radioInputs = Array.from(field.querySelectorAll(`input[name=${input.name}]`))
                if(radioInputs.some(rbtn=>rbtn.checked)){
                    return
                }
                return input
            }
            return input.value === '' || !input.value
        })
        console.log(empty)
        return empty
    }
    _incomplete(){
        this.setModal('Incomplete', 'Please fill in _all_ fields', 'fromTheTop')
    }
    _completed(){
        this.setModal('Complete', 'You have completed this field!', 'fromTheTop')
    }
    setModal(title, description, animation){
        this._modal.setAttribute('title', title)
        this._modal.setAttribute('description', description)
        this._modal.setAttribute('animation', animation)
        setTimeout(()=>{
            this._modal.setAttribute('open', '')
        })
    }
    _inlogInfo(field){
        const empty = this._empty(field)
        
        const password      = field.querySelector('input[name="password"]')
        const passwordCheck = field.querySelector('input[name="passwordCheck"]')

        if(password.value != passwordCheck.value){
            this.setModal('Password doesnt match', 'The filled in _passwords_ doesnt match with each other', 'fromTheTop')
            return
        }   
        if(empty){
            this._incomplete() 
            return
        }
        else{
            this._completed()
        }
    }
    _generalInfo(field){
        if(this._empty(field)){
            this._incomplete()
        }        
        else{
            this._completed()
        }
    }
    _photo(field){
        if(this._empty(field)){
            this._incomplete()
        }        
        else{
            this._completed()
        }       
    }
    _preference(field){
        const minAge = field.querySelector('input[name="minAge"]')
        const maxAge = field.querySelector('input[name="maxAge"]')
        
        if(minAge.value > maxAge.value){
            this.setModal('Min Age Higher?',  'Your Min Age is higher than Max Age?? Min Age has to belower than Max Age', 'fromTheTop')
            return
        }  
        if(this._empty(field)){
            this._incomplete()
            return
        }        
        else{
            this._completed()
        }        
    }
}
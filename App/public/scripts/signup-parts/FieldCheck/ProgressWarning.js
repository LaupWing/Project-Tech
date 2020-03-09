export default class ProgressWarning {
    constructor(){
        this._fields = Array.from(document.querySelectorAll('form .field'))
        this._modal  = document.querySelector('laup-modal') 
        this._steps  = document.querySelectorAll('.step')
    }
    checkField(e){
        const field       = e.target.closest('.step')
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
        const empty  = inputs.some(input => input.value === '' || !input.value)

        return empty
    }
    _incomplete(){
        this._modal.setAttribute('open', '')
        this._modal.setAttribute('title', 'Incomplete')
        this._modal.setAttribute('description', 'Please fill in _all_ fields')
    }
    _completed(){
        this._modal.setAttribute('open', '')
        this._modal.setAttribute('title', 'Complete')
        this._modal.setAttribute('description', 'You have completed this field!')
    }
    _inlogInfo(field){
        const empty = this._empty(field)
        
        const password      = field.querySelector('input[name="password"]')
        const passwordCheck = field.querySelector('input[name="passwordCheck"]')

        if(empty){
            this._incomplete() 
        }
        else if(password.value != passwordCheck.value){
            this._modal.setAttribute('open', '')
            this._modal.setAttribute('title', 'Password doesnt match')
            this._modal.setAttribute('description', 'The filled in _passwords_ doesnt match with each other')
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
        if(this._empty(field)){
            this._incomplete()
        }        
        else{
            this._completed()
        }        
    }
}
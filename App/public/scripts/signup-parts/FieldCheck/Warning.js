export default class Warning {
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
    _inlogInfo(field){
        console.log(field)        
    }
    _generalInfo(field){
        console.log(field)        
    }
    _photo(field){
        console.log(field)        
    }
    _preference(field){
        console.log(field)         
    }
}
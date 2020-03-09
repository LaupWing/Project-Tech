class Warning {
    constructor(){
        this._fields = Array.from(document.querySelectorAll('form .field'))
        this._modal  = document.querySelector('laup-modal') 
    }
    checkField(e){
        const field       = e.target.closest('.step')
        const indexField  = Array.from(this.steps).findIndex(x=>x===field)
        const inputFields = document.querySelectorAll('form .field')
        const field       = inputFields[indexField]
        switch(indexField) {
            case 1:
                this._inlogInfo(field)
                break
            case 2:
                this._generalInfo(field)
                break
            case 3:
                this._photo(field)
                break
            case 4:
                this._preference(field)
                break
            default: return
          }
    }
    _inlogInfo(field){

    }
    _generalInfo(field){

    }
    _photo(field){

    }
    _preference(field){

    }
}
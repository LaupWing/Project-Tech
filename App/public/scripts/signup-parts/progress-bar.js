import {checkDone} from './utils/utils.js'
export default class ProgressBar{
    constructor(){
        this._bars    = document.querySelectorAll('.bar')
        this._fields  = Array.from(document.querySelectorAll('.field'))
        this._buttons = document.querySelectorAll('form button')
        checkDone(this._bars)
        this._fields.forEach(field=>
            field.addEventListener('transitionend', checkDone.bind(this, this._bars))
        )
        this._bars.forEach(bar=>bar.addEventListener('click', this._barClick.bind(this)))
    }
    _barClick(e){
        const index = Array.from(this._bars).findIndex(el=>el===e.currentTarget)
    }
}
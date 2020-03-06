export default class ProgressBar{
    constructor(){
        this._bars    = document.querySelectorAll('.bar')
        this._fields  = Array.from(document.querySelectorAll('.field'))
        this._buttons = document.querySelectorAll('form button')
        this._checkDone()
        this._fields.forEach(field=>field.addEventListener('transitionend', this._checkDone.bind(this)))
        this._bars.forEach(bar=>bar.addEventListener('click', this._barClick.bind(this)))
    }
    _barClick(e){
        const index = Array.from(this._bars).findIndex(el=>el===e.currentTarget)
        console.log(e.currentTarget, index)
    }
    _checkDone(){
        const done = this._fields.filter(field=>field.classList.contains('done')).length
        this._bars.forEach(bar=>bar.classList.remove('active'))
        this._bars[done].classList.add('active')
    }
}
export default class ProgressBar{
    constructor(){
        this._bars    = document.querySelectorAll('.bar')
        this._fields  = Array.from(document.querySelectorAll('.field'))
        this._buttons = document.querySelectorAll('form button')
        this.checkDone()
        this._fields.forEach(field=>field.addEventListener('transitionend', this.checkDone.bind(this)))
    }
    checkDone(){
        const done = this._fields.filter(field=>field.classList.contains('done')).length
        this._bars.forEach(bar=>bar.classList.remove('active'))
        this._bars[done].classList.add('active')
    }
}
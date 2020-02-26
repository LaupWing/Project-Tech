class ProgressBar{
    constructor(){
        this._bars   = document.querySelectorAll('.bar')
        this._fields = Array.from(document.querySelectorAll('.field'))
        this.checkDone()
    }
    checkDone(){
        const done = this._fields.filter(field=>field.classList.contains('done')).length
        this._bars.forEach(bar=>bar.classList.remove('active'))
        this._bars[done].classList.add('active')
    }
}
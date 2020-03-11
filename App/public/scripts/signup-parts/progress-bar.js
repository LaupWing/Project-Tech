import {checkDone, initValueChecks}     from './utils/utils.js'
import Warning from './FieldCheck/ProgressWarning.js'
import ProgressChecker from './utils/ProgressChecker.js'

export default class ProgressBar{
    constructor(){
        this.warning   = new Warning()
        this._bars     = document.querySelectorAll('.bar')
        this._fields   = Array.from(document.querySelectorAll('.field'))
        this._buttons  = document.querySelectorAll('form button')
        this.inputs    = document.querySelectorAll('input')
        this._progress = new ProgressChecker('mobile')
        checkDone(this._bars)
        initValueChecks()
        this._fields.forEach(field=>
            field.addEventListener('transitionend', checkDone.bind(this, this._bars))
        )
        this.inputs.forEach(input=>input.addEventListener('input', 
            this._progress.checkInput.bind(this._progress))
        ) 
        this._bars.forEach(bar=>bar.addEventListener('click', this.checkWarning.bind(this)))
    }
    checkWarning(e){
        this.warning.checkField(document.querySelector(`.step.${e.currentTarget.classList[1]}`))
    }
}
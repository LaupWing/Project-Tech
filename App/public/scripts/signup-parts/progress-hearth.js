import Warning         from './FieldCheck/ProgressWarning.js'
import {checkDone, initValueChecks}     from './utils/utils.js'
import ProgressChecker from './utils/ProgressChecker.js'

export default class ProgressHearth{
    constructor(){
        this.warning         = new Warning()
        this.stepsContainer  = document.querySelector('.progress')
        this.inputs          = document.querySelectorAll('input')
        this._svgs           = document.querySelectorAll('.step svg')
        this.steps           = document.querySelectorAll('.step')
        this._fields         = Array.from(document.querySelectorAll('.field'))
        this._progress       = new ProgressChecker('desktop')
        checkDone(this._svgs)
        this._fields.forEach(field=>
            field.addEventListener('transitionend', checkDone.bind(this, this._svgs))
        )
        this.inputs.forEach(input=>input.addEventListener('input', 
            this._progress.checkInput.bind(this._progress))
        ) 
        this.steps.forEach(step=>step.addEventListener('click', this.checkWarning.bind(this))) 
        initValueChecks()
    }
    checkWarning(e){
        this.warning.checkField(e.target.closest('.step'))
    }
}
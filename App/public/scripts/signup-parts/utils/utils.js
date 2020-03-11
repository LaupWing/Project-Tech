const checkDone = (progress)=>{
    const fields =  Array.from(document.querySelectorAll('.field'))
    const done   = fields.filter(field=>field.classList.contains('done')).length
    progress.forEach(p=>p.classList.remove('active'))
    progress[done].classList.add('active')
}

const initValueChecks = ()=>{
    const stepsContainer = document.querySelector('.progress')
    document.querySelectorAll('input').forEach(input=>{
        if(input.value !== ''){
            if(input.type === 'radio'){
                if(!input.checked){
                    return
                }
            }
            stepsContainer.querySelector(`.${input.name}`).classList.add('done')  
        }
    })
}

export {
    checkDone,
    initValueChecks
}
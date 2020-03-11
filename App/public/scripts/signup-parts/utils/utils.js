const checkDone = (progress)=>{
    const fields =  Array.from(document.querySelectorAll('.field'))
    const done   = fields.filter(field=>field.classList.contains('done')).length
    progress.forEach(p=>p.classList.remove('active'))
    progress[done].classList.add('active')
}


export {
    checkDone
}
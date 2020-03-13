export default (user)=>{
    const modal = document.querySelector('laup-modal')
    modal.setAttribute('open', '')
    modal.setAttribute('title', 'Its a match!')
    modal.setAttribute('description', `You got a match with _${user.name}_`)
}
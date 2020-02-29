export default class {
    constructor(){
        this.el
    }
    create(element){
        const checkIdOrClass = element.includes('#') || element.includes('.') 
        if(checkIdOrClass){
            const splitted = element.includes('#') ? element.split('#') : element.split('.')
            this.el = document.createElement(splitted[0])
            if(splitted[1]=== '#'){
                this.el.id = splitted[1].replace('#', '')
            }else{
                this.el.className = splitted[1].replace('.', '')
            }
        }
        return this
    }
    removeChilds(parent){
        while (parent.firstChild) {
            parent.firstChild.remove()
        }
    }
}
export default class {
    constructor(){
        this.el
    }
    create(element){
        this.el = document.createElement(element)
        return this
    }
    classes(list){
        list.forEach(item=>{
            this.el.classList.add(item)
        })
    }
    id(id){
        this.$el.id= id
        return this
    }
    attr(type, value){
        this.el.setAttribute(type, value)
        return this
    }
    removeChilds(parent){
        while (parent.firstChild) {
            parent.firstChild.remove()
        }
    }
}
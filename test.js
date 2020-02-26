class CreateElement{
    constructor(){
        this.element
    }
    create(type){
        if(type.includes('.')||type.includes('#')){
            const parts = type.includes('.') 
                ? type.split('.')
                : type.split('#')
            this.element = document.createElement(parts[0])
            if(type.includes('.')){
                this.element.className = parts[1]
            }else{
                this.element.id = parts[1]
            }
        }
        return this
    }
    txt(txt){
        if(this.element){
            this.element.textContent = txt
        }
        return this
    }
}
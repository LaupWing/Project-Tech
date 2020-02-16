export default class {
    removeChilds(parent){
        while (parent.firstChild) {
            parent.firstChild.remove()
        }
    }
}
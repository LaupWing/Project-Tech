class Modal extends HTMLElement{
    constructor(){
        super()
        this.attachShadow({mode: 'open'})
        this.shadowRoot.innerHTML = `
            <style>
                *{
                    margin: 0;
                    padding: 0;
                }
                :host([open]) #backdrop,
                :host([open]) #modal{
                    pointer-events: all;
                    opacity:1;
                }
                :host([open]) #modal{
                    top: 30vh;
                }
                #backdrop{
                    position: fixed;
                    top: 0;
                    left:0;
                    width: 100vw;
                    height: 100vh;
                    z-index: 10;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    pointer-events: none;
                    opacity:0;
                    transition: .5s all;
                    background-color: rgba(0,0,0,.5);
                }
                #modal{
                    position: fixed;
                    z-index: 100;
                    top: -50vh;
                    background: white;
                    border-radius: 5px;
                    pointer-events: none;
                    opacity:0;
                    transform: translateX(-50%);
                    display: flex;
                    flex-direction: column;
                    align-items:center;
                    padding: 5px 15px;
                    width: 50%;
                    transition: .5s all;
                }
                button{
                    background: var(--main-color);
                }
                button{
                    display: flex;
                    align-items: center;
                    background-clip: padding-box;
                    border: solid 3px transparent;
                    text-align: center;
                    position: relative;
                    justify-content: center;
                    color: black;
                    padding: 2px 15px;
                    color:var(--blue);
                    margin-bottom: 5px;
                    text-transform: uppercase;
                }
                h2{
                    color: var(--purp);
                }
                p{
                    margin: 10px 0;
                    text-align:center;
                    margin-bottom: 15px;
                    font-size: .8em;
                }
                p span{
                    color: var(--red);
                }
                button::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    z-index: -1;
                    margin: -3px;
                    border-radius: inherit;
                    background: var(--main-gradientColor);
                }

            </style>
            <div id="backdrop"></div>
            <div id="modal">
                <h2></h2>
                <p></p>
                <button>Ok</button>
            </div>
        `
        this._title         = 'Warning'
        this._description   = 'Here comes _your_ warning message'
        this._titleEl       = this.shadowRoot.querySelector('#modal h2')
        this._descriptionEl = this.shadowRoot.querySelector('#modal p')
        this._buttonEl      = this.shadowRoot.querySelector('#modal button')
        this.opened         = false
        this._buttonEl.addEventListener('click', this._closeModal.bind(this))
    }
    connectedCallback(){
        if(this.hasAttribute('title')){
            this._title = this.getAttribute('title')
        }
        else if(this.hasAttribute('description')){
            this._description = this.getAttribute('description')
        }
        this._titleEl.textContent     = this._title
        this._descriptionEl.innerHTML = this.checkHighlight(this._description)
    }
    attributeChangedCallback(name, oldValue, newValue){
        switch(name){
            case 'open':
                this.opened = !this.opened
                break
            case 'title':
                this._title = newValue
                this._titleEl.textContent = this._title
                break
            case 'description':
                this._description = newValue
                this._descriptionEl.textContent = this._description
                break
            default: null
        }
    }
    checkHighlight(string){
        const highlightString = string
            .replace('_', '<span>')
            .replace('_', '</span>')
        return highlightString
    }
    static get observedAttributes(){
        return ['title', 'description']
    }
    _closeModal(){
        this.opened = false
        this.removeAttribute('open')
    }
    _getPosition(string, subString, index) {
        return string.split(subString, index).join(subString).length;
    }
}

customElements.define('laup-modal', Modal)
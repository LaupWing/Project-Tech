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
                :host([open]) #modal.fromTheTop{
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
                    top: 30vh;
                    z-index: 100;
                    background: white;
                    border-radius: 5px;
                    pointer-events: none;
                    opacity:0;
                    transform: translateX(-50%);
                    display: flex;
                    flex-direction: column;
                    align-items:center;
                    max-width: 280px;
                    padding: 8px 15px;
                    width: 80%;
                    left: 50vw;
                    transition: .5s all;
                }
                #modal.fromTheTop{
                    top: -50vh;
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
                    text-align: center;
                    font-size: 1.2rem;
                }
                p{
                    margin: 10px 0;
                    text-align:center;
                    margin-bottom: 15px;
                    font-size: .8em;
                }
                p span{
                    color: var(--red);
                    font-weight: bold;
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
        this._animation     = ''
        this._modalEl       = this.shadowRoot.querySelector('#modal')
        this._titleEl       = this.shadowRoot.querySelector('#modal h2')
        this._descriptionEl = this.shadowRoot.querySelector('#modal p')
        this._buttonEl      = this.shadowRoot.querySelector('#modal button')
        this._backdropEl    = this.shadowRoot.querySelector('#backdrop')
        this.opened         = false
        this._buttonEl.addEventListener('click', this._closeModal.bind(this))
        this._backdropEl.addEventListener('click', this._closeModal.bind(this))
    }
    connectedCallback(){
        if(this.hasAttribute('title')){
            this._title = this.getAttribute('title')
        }
        if(this.hasAttribute('description')){
            this._description = this.getAttribute('description')
        }
        if(this.hasAttribute('animation')){
            this._animation = this.getAttribute('animation')
        }
        this._titleEl.textContent     = this._title
        this._modalEl.className       = this._animation
        this._descriptionEl.innerHTML = this.checkHighlight(this._description)
    }
    attributeChangedCallback(name, oldValue, newValue){
        switch(name){
            case 'open':
                this.opened = !this.opened
                break
            case 'title':
                this._title               = newValue
                this._titleEl.textContent = this._title
                break
            case 'description':
                this._description             = newValue
                this._descriptionEl.innerHTML = this.checkHighlight(this._description)
                break
            case 'animation':
                this._animation         = newValue
                this._modalEl.className = this._animation
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
        return ['title', 'description', 'animation']
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
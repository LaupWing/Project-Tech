class Modal extends HTMLElement{
    constructor(){
        super()
        this.attachShadow({mode: 'open'})
        this.shadowRoot.innerHTML = `
            <style>
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
                }
                #modal{
                    position: fixed;
                    top: 15vh;
                    z-index: 100;
                    background: white;
                    border-radius: 5px;
                }
            </style>
            <div id="backdrop"></div>
            <div id="modal">
                <h2></h2>
            </div>
        `
        this._title = 'Warning'
        this._titleEl = this.shadowRoot.querySelector('#modal h2')
    }
    connectedCallback(){
        if(this.hasAttribute('title')){
            this._title = this.getAttribute('title')
        }
        this._titleEl.textContent = this._title
    }
}

customElements.define('laup-modal', Modal)
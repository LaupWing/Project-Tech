console.log('signuppage')
// Todo!!!!!!!!!!!!!
// When user changes his/her age the slides automatic changes
class imageLoader{
    constructor(){
        this.input = document.querySelector('input[type="file"]') 
        console.log(this.imageLoader)
        this.input.addEventListener('change',()=> this.readFile(this))
    }
    readFile(input){
        if(input.input.files && input.input.files[0]){
            const reader = new FileReader()
            reader.onload = function (e){
                console.log(e)
                document.querySelector('img').src = e.target.result
            }
            reader.readAsDataURL(input.input.files[0]);
        }
    }
}
new imageLoader()
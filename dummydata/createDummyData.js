const User = require('../App/models/user')
const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const FormData = require('form-data')
//     email,
//     password,
//     passwordCheck,
//     age,
//     name,
//     minAge,
//     gender,
//     maxAg
const users = [
    {
        image: '1.jpeg',
        name: 'Gerard',
        email: 'gerard@hotmail.com',
        password: 'test123',
        age: 30,
        minAge: 25,
        maxAge: 50,
        gender: 'male'
    },
    // {
    //     image: '2.jpg',
    //     name: 'Kees',
    //     email: 'kees@hotmail.com',
    //     password: 'test123',
    //     age: 40,
    //     minAge: 18,
    //     maxAge: 60,
    //     gender: 'male'
    // },
    // {
    //     image: '3.jpeg',
    //     name: 'Marjolein',
    //     email: 'marjolein@hotmail.com',
    //     password: 'test123',
    //     age: 18,
    //     minAge: 18,
    //     maxAge: 50,
    //     gender: 'female'
    // },
    // {
    //     image: '4.jpg',
    //     name: 'Henk',
    //     email: 'henk@hotmail.com',
    //     password: 'test123',
    //     age: 45,
    //     minAge: 30,
    //     maxAge: 50,
    //     gender: 'male'
    // },
    // {
    //     image: '5.jpg',
    //     name: 'Thierry',
    //     email: 'thierry@hotmail.com',
    //     password: 'test123',
    //     age: 25,
    //     minAge: 18,
    //     maxAge: 35,
    //     gender: 'male'
    // },
    // {
    //     image: 'johny_bravo.png',
    //     name: 'Johny Bravo',
    //     email: 'johny@hotmail.com',
    //     password: 'test123',
    //     age: 22,
    //     minAge: 18,
    //     maxAge: 40,
    //     gender: 'male'
    // },
    // {
    //     image: 'lois.jpg',
    //     name:'Lois',
    //     email: 'lois@hotmail.com',
    //     password: 'test123',
    //     age: 38,
    //     minAge: 22,
    //     maxAge: 55,
    //     gender: 'female'
    // },
    // {
    //     image: 'malone.jpg',
    //     name:'Toasty Malony',
    //     email: 'toasty@hotmail.com',
    //     password: 'test123',
    //     age: 24,
    //     minAge: 18,
    //     maxAge: 30,
    //     gender: 'male'
    // },
    // {
    //     image: 'marge.jpg',
    //     name: 'Marge Simpson',
    //     email: 'marge@hotmail.com',
    //     password: 'test123',
    //     age: 45,
    //     minAge: 30,
    //     maxAge: 50,
    //     gender: 'female'
    // },
    // {
    //     image: 'misty.png',
    //     name: 'Misty',
    //     email: 'misty@hotmail.com',
    //     password: 'test123',
    //     age: 18,
    //     minAge: 18,
    //     maxAge: 50,
    //     gender: 'female'
    // },
]

const imgurBase64Upload = async(base64)=>{
    console.log('upload..')
    const url = 'https://api.imgur.com/3/image'
    const form = new FormData()
    const cliendId = '8a49497fbb1b7c4'
    form.append('image', base64)
    const options = {
        method: 'POST',
        body: form,
        headers:{
            Authorization: `Client-ID ${cliendId}`
        }
    }
    const res = await fetch(url,options)
    const json = await res.json()
    
    return json.data.link
}
const savingUsers = users.map(async (user)=>{
    const file = fs.readFileSync(path.join(__dirname,`images/${user.image}`))
    const base64data = new Buffer.from(file).toString('base64')
    let image=null
    const res = await imgurBase64Upload(base64data)
    console.log(res)
    try{
        image = res.data.link
    }catch(e){
        image = base64data
    }
    // console.log(image)
    const newUser = new User({
        email: user.email,
        password: user.password,
        age: user.age,
        minAge: user.minAge,
        maxAge: user.maxAge,
        name: user.name,
        gender: user.gender,
        images:[
            {
                url: image,
                mainPicture: true
            }
        ]
    })
    try{
        await newUser.save()
    }catch(e){
        console.log(e)
    }
    // return newUser.save()
    
})


Promise.all(savingUsers).then(users=>{
        console.log('heh')
        console.log(users)
    })

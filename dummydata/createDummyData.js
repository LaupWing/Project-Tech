const User = require('../App/models/user')
const fs = require('fs')
const path = require('path')
const imgurBase64Upload = require('../App/utils/base64link')
require('../App/db/mongoose')

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
    {
        image: '2.jpg',
        name: 'Kees',
        email: 'kees@hotmail.com',
        password: 'test123',
        age: 40,
        minAge: 18,
        maxAge: 60,
        gender: 'male'
    },
    {
        image: '3.jpeg',
        name: 'Marjolein',
        email: 'marjolein@hotmail.com',
        password: 'test123',
        age: 18,
        minAge: 18,
        maxAge: 50,
        gender: 'female'
    },
    {
        image: '4.jpg',
        name: 'Henk',
        email: 'henk@hotmail.com',
        password: 'test123',
        age: 45,
        minAge: 30,
        maxAge: 50,
        gender: 'male'
    },
    {
        image: '5.jpg',
        name: 'Thierry',
        email: 'thierry@hotmail.com',
        password: 'test123',
        age: 25,
        minAge: 18,
        maxAge: 35,
        gender: 'male'
    },
    {
        image: 'johny_bravo.png',
        name: 'Johny Bravo',
        email: 'johny@hotmail.com',
        password: 'test123',
        age: 22,
        minAge: 18,
        maxAge: 40,
        gender: 'male'
    },
    {
        image: 'lois.jpg',
        name:'Lois',
        email: 'lois@hotmail.com',
        password: 'test123',
        age: 38,
        minAge: 22,
        maxAge: 55,
        gender: 'female'
    },
    {
        image: 'malone.jpg',
        name:'Toasty Malony',
        email: 'toasty@hotmail.com',
        password: 'test123',
        age: 24,
        minAge: 18,
        maxAge: 30,
        gender: 'male'
    },
    {
        image: 'marge.jpg',
        name: 'Marge Simpson',
        email: 'marge@hotmail.com',
        password: 'test123',
        age: 45,
        minAge: 30,
        maxAge: 50,
        gender: 'female'
    },
    {
        image: 'misty.png',
        name: 'Misty',
        email: 'misty@hotmail.com',
        password: 'test123',
        age: 18,
        minAge: 18,
        maxAge: 50,
        gender: 'female'
    },
]


const savingUsers = users.map(async (user)=>{
    const file = fs.readFileSync(path.join(__dirname,`images/${user.image}`))
    const base64data = new Buffer.from(file).toString('base64')
    let image=null
    
    try{
        const link = await imgurBase64Upload(base64data)
        image = link
    }catch(e){
        image = base64data
    }
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
    return newUser
    
})


Promise.all(savingUsers).then(users=>{
        console.log('heh')
        console.log(users)
})

const User = require('../App/models/user')
const fs = require('fs')
const path = require('path')
const imgur = require('imgur')
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

const savedUsers = users.map(async (user)=>{
    const file = fs.readFileSync(path.join(__dirname,`images/${user.image}`))
    const base64data = new Buffer.from(file).toString('base64')
    let image=null
    try{
        const res = await imgur.uploadBase64(base64data)
        image = res.data.link
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
    return newUser.save()
    
})

Promise.all(savedUsers).then(users=>{
        console.log('heh')
        console.log(users)
    })
// const {
//     email,
//     password,
//     passwordCheck,
//     age,
//     name,
//     minAge,
//     gender,
//     maxAge} = req.body
// // This below is check on the client side but just to be save
// if(passwordCheck!==password){    
//     return res.redirect('/auth')
// }
// const base64data = new Buffer.from(req.file.buffer).toString('base64')
// let image=null
// try{
//     const res = await imgur.uploadBase64(base64data)
//     image = res.data.link
// }catch(e){
//     image = base64data
// }

// const user = new User({
//     email,
//     password,
//     age,
//     minAge,
//     maxAge,
//     name,
//     gender,
//     images:[
//         {
//             url: image,
//             mainPicture: true
//         }
//     ]
// })
// try{
//     await user.save()
//     const token = await user.generateAuthToken()
//     res.cookie('dating_token',token,{
//         httpOnly:true,
//         maxAge: (24*7) * 60 * 60 * 1000 // 7 days in miliseconds because it is in miliseconds
//     })
//     res.redirect('/')
// }catch(e){
//     res.redirect('/login')
// }
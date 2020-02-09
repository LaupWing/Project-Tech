const getMatch = async (socket, user)=>{
    const listOfUsers = user.couldBeAMatch
    const match = listOfUsers[Math.floor(Math.random() * listOfUsers.length)]
    if(match){
        user.currentMatching = match
        socket.emit('sending match', {
            name: match.name,
            images: match.images,
            age: match.age,
            gender: match.gender
        })
    }else{
        socket.emit('sending match', {
            name: 'i have nobody',
            images: [{
                url:'https://i.ytimg.com/vi/6EEW-9NDM5k/maxresdefault.jpg',
                mainPicture:true
            }],
            age: 'infinite',
            gender: 'unknown'
        })
    }
}

module.exports ={
    getMatch
}

// async ()=>{
//     const listOfUsers = activeUsers[`user_${socket.id}`].canBeAMatch
//     const match = listOfUsers[Math.floor(Math.random() * listOfUsers.length)]
//     if(match){
//         activeUsers[`user_${socket.id}`].currentMatching = match
//         socket.emit('sending match', {
//             name: match.name,
//             images: match.images,
//             age: match.age,
//             gender: match.gender
//         })
//     }else{
//         socket.emit('sending match', {
//             name: 'i have nobody',
//             images: [{
//                 url:'https://i.ytimg.com/vi/6EEW-9NDM5k/maxresdefault.jpg',
//                 mainPicture:true
//             }],
//             age: 'infinite',
//             gender: 'unknown'
//         })
//     }
// }
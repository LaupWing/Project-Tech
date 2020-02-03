const {README} = require('./boilerplate')
const fs = require('fs')

const added = (name)=>{
    fs.writeFile('../Logs/'+name+'/REAMDE.md',README, (err)=> err ? console.log(err) : null )
}
module.exports = added
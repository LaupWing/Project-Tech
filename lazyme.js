const fs = require('fs')
const added = require('./lazymeUtils/Added') 
const folderPath = './Logs'
let snapshotLength = null

const getAllFiles = ()=>{
    return fs.readdirSync(folderPath, (err,files)=>files)
}

const init = ()=>{
    snapshotLength = getAllFiles().length
}

fs.watch(folderPath, (event, filename)=>{
    const filesNow = getAllFiles().length
    if(filesNow < snapshotLength){
        console.log('DELETED: ' ,filename)
    }
    else if(filesNow > snapshotLength){
        console.log('ADDED NEW FOLDER', filename)
        added(filename)
    }
    snapshotLength = filesNow
})

init()
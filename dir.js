const fs = require('fs')

if (!fs.existsSync('./new')) { //always check if a file or dir exist before reading, writing, appending, renaming, and deleting.
    fs.mkdir('./new', (err) => {
        if (err) throw err
        console.log('Directory Created!')
    })//adding dir
}else{
    fs.rmdir('./new', (err) => {
        if (err) throw err
        console.log('Directory Removed!')
    })//removing dir
}
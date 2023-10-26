const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

//this is how to read from files and this is an asynchronous function.
fs.readFile(path.join(__dirname, 'files', 'starter.txt'), 'utf8', (err, data) => {
    if(err) throw err
    console.log(data)
})

//===========================================================================================================================================================================
const fileOps = async () => {
    try {
        const data = await fsPromises.readFile(path.join(__dirname, 'files', 'starter.txt'), 'utf8')
        console.log('==========\nNew approach: ', data, '\n==========')

        // await fsPromises.unlink(path.join(__dirname, 'files', 'starter.txt')) //delete files
        await fsPromises.writeFile(path.join(__dirname, 'files', 'promiseWrite.txt'), data)
        await fsPromises.appendFile(path.join(__dirname, 'files', 'promiseWrite.txt'), '\n\nNice to meet you!')
        await fsPromises.rename(path.join(__dirname, 'files', 'promiseWrite.txt'), path.join(__dirname, 'files', 'NewPromiseWrite.txt'))

        const newData = await fsPromises.readFile(path.join(__dirname, 'files', 'NewPromiseWrite.txt'), 'utf8')
        console.log('==========\nNew Data approach: ', newData, '\n==========')
    } catch (err) {
        console.error(err)
    }
}

fileOps()

//above approach is better than below approach

//this is how to write from files and this is an asynchronous function.
//this will automatically creates a file when the file doesn't exist.
fs.writeFile(path.join(__dirname, 'files', 'write.txt'), 'This is the content when you write files and if the file is not exist it will create one.', (err) => {
    if(err) throw err
    console.log('Writing files completed!')

    fs.appendFile(path.join(__dirname, 'files', 'write.txt'), '\n\nYes it is.', (err) => {
        if(err) throw err
        console.log('Append from files completed!')
        //to rename file
                    //current dir and filename                  //new or updated filename
        fs.rename(path.join(__dirname, 'files', 'write.txt'), path.join(__dirname, 'files', 'NewWrite.txt'), (err) => {
            if(err) throw err
            console.log('Rename file completed!')
        })
    })
})
//===========================================================================================================================================================================

//this is how to append from files and this is an asynchronous function.
//this will automatically creates a file when the file doesn't exist.
fs.appendFile(path.join(__dirname, 'files', 'test.txt'), 'Testing text.', (err) => {
    if(err) throw err
    console.log('Append from files completed!')
})

console.log('Hello...')

//exit on uncaught errors
process.on('uncaughtException', err => {
    console.error(`There was an uncaught error: ${err}`)
    process.exit(1)
})
const http = require('http')
const path = require('path')
const fs = require('fs')
const fsPromises = require('fs').promises

const logEvents = require('./logEvents')
const EventEmitter = require('events')

class Emitter extends EventEmitter{ }

//initialize object
const myEmitter = new Emitter()

//add listener for the log event
myEmitter.on('log', (msg, fileName) => logEvents(msg, fileName))

//define the port
const PORT = process.env.PORT || 3500

//serve the file that really exists and for 404 page
const serveFile = async (filePath, contentType, response) => {
    try {
        const rawData = await fsPromises.readFile(
            filePath, 
            !contentType.includes('image') ? 'utf-8' : null //if ever that the content-type is an image
        ) //get data from the file
        const data = contentType === 'application/json' //if you requested a json content-type
            ? JSON.parse(rawData) : rawData
        response.writeHead(
            !filePath.includes('404.html') ? 200 : 400, //if ever that the page is 404 not found
            { 'Content-Type': contentType }
        ) //redirect to the file that is requested
        response.end(
            contentType === 'application/json' ? JSON.stringify(data) : data 
        )
    } catch (err) {
        console.error(err)
        myEmitter.emit('log', `${err.name}: ${err.massage}`, 'errorLog.txt') //logging request error
        response.statusCode = 500 //this could be 500 statusCode for server error
        response.end() //end the response
    }
}

//create server
const server = http.createServer((req, res) => {
    console.log(req.url, req.method)
    //emit event
    myEmitter.emit('log', `${req.url}\t${req.method}`, 'requestLog.txt') //logging request

    //get file extension from req.url (.css, .html, .js, .jpg, .json, etc.)
    const extension = path.extname(req.url)

    //define or set content-type via switch statement that we expect to be served
    let contentType

    switch (extension) {
        case '.css':
            contentType = 'text/css'
            break;
        case '.js':
            contentType = 'text/javascript'
            break;
        case '.json':
            contentType = 'application/json'
            break;
        case '.jpg':
            contentType = 'image/jpeg'
            break;
        case '.png':
            contentType = 'image/png'
            break;
        case '.txt':
            contentType = 'text/plain'
            break;
        default:
            contentType = 'text/html'
            break;
    }

    //use chain ternary statement method to set the value for filePath
    let filePath = 
        contentType === 'text/html' && req.url === '/'  
            ? path.join(__dirname, 'views', 'index.html') //this would be the value of filePath if the req.url is just '/' and the content-type is html
            : contentType === 'text/html' && req.url.slice(-1) === '/' //this condition is for subdir folder
                ? path.join(__dirname, 'views', req.url, 'index.html') //join dir/views/subdir/index.html
                : contentType === 'text/html' 
                    ? path.join(__dirname, 'views', req.url) //look for what ever is requested in the views folder 
                    : path.join(__dirname, req.url) //if content-type is other than text/html possibly it is css, image, json, js, etc.
    
    //if there is no file extension name
    //makes .html extension not required in the browser
    if (!extension && req.url.slice(-1) !== '/') {
        filePath += '.html'
    }
    
    //this will return true if the file path really exists otherwise false
    const fileExists = fs.existsSync(filePath)

    //check if the file really exists
    if (fileExists) {
        //serve the file
        serveFile(filePath, contentType, res)
    }else{
        //if the file doesn't exist and this could be 404 or 301 redirect
        console.log('Parsed path: ', path.parse(filePath))

        switch (path.parse(filePath).base) {
            case 'old-page.html':
                res.writeHead(301, { 'Location': '/new-page.html' }) //if you entered 'old-page' in the url, you'll be redirected to 'new-page.html'
                res.end() //end the response
                break;
            case 'www-page.html':
                res.writeHead(301, { 'Location': '/' }) //redirect to the root which is the slash '/'
                res.end()
                break;
            default:
                //serve a 404 response
                serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res)
                break;
        }
    }

})

//web creates a server that listens on port you define on your computer
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
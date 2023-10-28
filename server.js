const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const { logger } = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')

//define the port
const PORT = process.env.PORT || 3500

// custom middleware logger
// next call is need for custom middleware
app.use(logger)

// 3rd party middleware
// to request data from other domain (ie: google.com)
// create a list that is allowed to access the backend
const whitelist = ['https://www.yoursite.com', 'https://127.0.0.1:5500', 'http://localhost:3500']
const corsOptions = {
            //origin parameter here coming from who ever requested it like google.com
    origin: (origin, callback) => {
        //if the domain is in the whitelist
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            //null here means there's no error, true means that the origin will sent back and that is allowed
            callback(null, true)
        } else{
            callback(new Error('Not allowed by CORS'))
        }
    }, 
    optionsSuccessStatus: 200
}
// Cross Origin Resource Sharing
app.use(cors(corsOptions))

// built-in middleware to handle urlencoded data
// in other words, form data: 
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }))

// built-in middleware for json
app.use(express.json())

// serve static files such as css, images, etc.
app.use('/', express.static(path.join(__dirname, '/public')))
app.use('/subdir', express.static(path.join(__dirname, '/public')))

//routes
app.use('/', require('./routes/root'))
app.use('/subdir', require('./routes/subdir'))
app.use('/employees', require('./routes/api/employees'))

//404 page not found!
app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ error: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

//custom error handler
app.use(errorHandler)

//web creates a server that listens on port you define on your computer
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
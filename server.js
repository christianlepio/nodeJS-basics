const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const { logger } = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')

//define the port
const PORT = process.env.PORT || 3500

// custom middleware logger
// next call is need for custom middleware
app.use(logger)

// 3rd party middleware
// Cross Origin Resource Sharing (CORS)
app.use(cors(corsOptions))

// built-in middleware to handle urlencoded data
// in other words, form data: 
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }))

// built-in middleware for json
app.use(express.json())

// serve static files such as css, images, etc.
app.use('/', express.static(path.join(__dirname, '/public')))

//routes
app.use('/', require('./routes/root'))
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
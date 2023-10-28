const express = require('express')
const app = express()
const path = require('path')

//define the port
const PORT = process.env.PORT || 3500

//get method route
//regex used: 
// ^ begin with, 
// $ ends with,
// | or,
app.get('^/$|/index(.html)?', (req, res) => {
    // res.send('Hello Express JS')
    res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

app.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'))
})

app.get('/old-page(.html)?', (req, res) => {
    res.redirect(301, '/new-page.html') //this will send 302 status code by default
})

//Route Handlers
//these route handlers works similarly to what we called middleware
app.get('/hello(.html)?', (req, res, next) => {
    console.log('Attempted to load hello.html')
    next()
}, (req, res) => {
    res.send('This page is after next()')
})

//chaining route handlers
const one = (req, res, next) => {
    console.log('one')
    next()
}
const two = (req, res, next) => {
    console.log('two')
    next()
}
const three = (req, res) => {
    console.log('three')
    res.send('Chain routing Finished')
}

app.get('/chain(.html)?', [one, two, three])

app.get('/*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
})

//web creates a server that listens on port you define on your computer
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
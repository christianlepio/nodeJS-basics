const express = require('express')
const router = express.Router()
const path = require('path')

//get method route
//regex used: 
// ^ begin with, 
// $ ends with,
// | or,
router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

router.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'new-page.html'))
})

router.get('/old-page(.html)?', (req, res) => {
    res.redirect(301, '/new-page.html') //this will send 302 status code by default
})

module.exports = router
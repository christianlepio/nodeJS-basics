const logEvents = require('./logEvents')

const EventEmitter = require('events')

class Emitter extends EventEmitter{ }

//initialize object
const myEmitter = new Emitter()

//add listener for the log event
myEmitter.on('log', (msg) => logEvents(msg))

setTimeout(() => {
    //emit event
    myEmitter.emit('log', 'Log event Emitted!')
}, 2000)
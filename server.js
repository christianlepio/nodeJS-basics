//before learning nodeJS you should already know:
//HTML, CSS, and Javascript
//Possibly experience with other libraries and frameworks

//How NodeJS differs from Vanilla JS
// 1. Node runs on a server - not in a browser (backend not frontend)
// 2. The console is the terminal window
console.log('Hello NodeJS')
// 3. Global object instead of window object
console.log('\n=================== Global keyword ====================')
console.log(global)
// 4. Has common core modules that we will explore
// 5. Common JS modules instead of ES6 Modules
// 6. Node JS is missing some JS APIs like fetch but we can always pull other packages 

//this is how you import in node JS by using 'require' keyword
const os = require('os')
const path = require('path')
const { add, subtract, multiply, divide } = require('./math') //destructuring method

console.log('\n=================== OS functions ====================')
console.log(os.type())
console.log(os.version())
console.log(os.homedir())

console.log('\n=================== Built in variables in nodeJS ====================')
console.log(__dirname)
console.log(__filename)

console.log('\n=================== Path Functions ====================')
console.log(path.dirname(__filename))
console.log(path.basename(__filename))
console.log(path.extname(__filename))

console.log('\n=================== Path parse function ====================')
console.log(path.parse(__filename))

console.log('\n=================== User-defined Math functions ====================')
console.log('Add: ', add(2, 3))
console.log('subtract: ', subtract(2, 3))
console.log('multiply: ', multiply(2, 3))
console.log('divide: ', divide(2, 3))
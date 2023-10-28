// 3rd party middleware
// to request data from other domain (ie: google.com)
// create a list that is allowed to access the backend
const whitelist = [
    'https://www.yoursite.com', 
    'https://127.0.0.1:5500', 
    'http://localhost:3500'
]

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

module.exports = corsOptions
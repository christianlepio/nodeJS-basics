const jwt = require('jsonwebtoken')
require('dotenv').config()

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization']

    if (!authHeader) {
        return res.sendStatus(401) //unauthorized status code
    } else {
        console.log('authHeader: ', authHeader)
        const token = authHeader.split(' ')[1] //remove bearer word from auth header
        //verify if accessToken is not yet expired
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            (err, decoded) => {
                if (err) {
                    return res.sendStatus(403) //this is forbidden status code: meaning invalid token
                } else {
                    req.user = decoded.username //pass decoded username to request user
                    next()
                }
            }
        )
    }
}

module.exports = verifyJWT //call this function or middleware to the routes you want to protect
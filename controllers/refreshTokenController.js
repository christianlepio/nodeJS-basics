const jwt = require('jsonwebtoken')
require('dotenv').config()

const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const handleRefreshToken = (req, res) => {
    const cookies = req.cookies
    //check if there is a cookie and get the jwt property
    if (!cookies?.jwt) {
        console.log(cookies.jwt)
        return res.sendStatus(401) //unauthorize status code
    } else {
        console.log(cookies.jwt)

        const refreshToken = cookies.jwt //get value for refreshToken
        //find user if does exist with refreshToken similar to cookie refresh token
        const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken)
        if (!foundUser) {
            return res.sendStatus(403) //403 status code is Forbidden
        } else {
            //evaluate jwt, check if refreshToken is not yet expired
            jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET,
                (err, decoded) => {
                    if (err || foundUser.username !== decoded.username) {
                        return res.sendStatus(403) //403 status code is Forbidden
                    } else {
                        //if refreshToken is not yet expired then create new accessToken
                        const accessToken = jwt.sign(
                            //payload
                            { "username": decoded.username },
                            process.env.ACCESS_TOKEN_SECRET, 
                            { expiresIn: '30s' }
                        )
                        res.json({ accessToken }) //send accessToken as response
                    }
                }
            )
        }
    }
}

module.exports = { handleRefreshToken }
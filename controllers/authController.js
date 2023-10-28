const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')
const fsPromises = require('fs').promises
const path = require('path')

const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body
    if (!user || !pwd) {
        return res.status(400).json({ 'message': 'Username and Password are required!' })
    } else {
        //find user if does exist
        const foundUser = usersDB.users.find(person => person.username === user)
        if (!foundUser) {
            return res.sendStatus(401) //401 status code is unauthorized
        } else {
            //evaluate password using bcrypt compare
            const matched = await bcrypt.compare(pwd, foundUser.password)
            if (matched) {
                //get all values for roles
                const roles = Object.values(foundUser.roles)

                //create JWTs from from this spot
                const accessToken = jwt.sign(
                    //payload
                    { 
                        "UserInfo": { 
                            "username": foundUser.username,
                            "roles": roles
                        }
                    }, //pass username and roles here, don't pass the value of password
                    process.env.ACCESS_TOKEN_SECRET, //evironment variable
                    { expiresIn: '30s' } //limit of time of access
                )
                
                const refreshToken = jwt.sign(
                    { "username": foundUser.username },
                    process.env.REFRESH_TOKEN_SECRET,
                    { expiresIn: '1d' } //refresh token should last much longer than accessToken
                )
                
                //saving refreshToken with current user to users.json
                const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username)
                const currentUser = { ...foundUser, refreshToken } //add refreshToken to property of current user

                usersDB.setUsers([...otherUsers, currentUser]) //set new users in usersDB
                await fsPromises.writeFile(
                    path.join(__dirname, '..', 'model', 'users.json'),
                    JSON.stringify(usersDB.users)
                ) //write or update users.json file
                
                //send refresh token to response cookie with http only to not available to JS for much security 
                                                                                    //this is also working in httpOnly
                                                                                    //this is required when working with chrome
                res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 })
                res.json({ accessToken }) //send access token to the client/user
            } else {
                res.sendStatus(401) //401 status code is unauthorized
            }
        }
    }
}

module.exports = { handleLogin }
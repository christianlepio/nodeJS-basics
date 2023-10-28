const fsPromises = require('fs').promises
const path = require('path')

const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const handleLogout = async (req, res) => {
    // on client-side or front-end, also delete the accessToken

    const cookies = req.cookies
    //check if there is a cookie and get the jwt property
    if (!cookies?.jwt) {
        return res.sendStatus(204) //success but no content
    } else {
        const refreshToken = cookies.jwt //get value for refreshToken
        //is refreshToken in DB?
        const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken)
        if (!foundUser) {
            //clear or erase cookie (refreshToken)
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
            return res.sendStatus(204) //success but no content
        } else {
            //Delete refresh token in the DB
            const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken)
            //Erase refresh token from current user
            const currentUser = { ...foundUser, refreshToken: '' }
            //update users from usersDB
            usersDB.setUsers([...otherUsers, currentUser])

            //update users.json file from data
            await fsPromises.writeFile(
                path.join(__dirname, '..', 'model', 'users.json'), //this is the path/file
                JSON.stringify(usersDB.users) //this is the content to be written in the path/file
            )
            //clear cookie
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
            res.sendStatus(204) //success but no content
        }
    }
}

module.exports = { handleLogout }
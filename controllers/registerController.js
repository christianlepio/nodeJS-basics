const fsPromises = require('fs').promises
const path = require('path')
const bcrypt = require('bcrypt')

const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body
    if (!user || !pwd) {
        return res.status(400).json({ 'message': 'Username and Password are required!' })
    } else {
        //check for duplicated username in the userDB
        const duplicated = usersDB.users.find(person => person.username === user)
        if (duplicated) {
            return res.sendStatus(409) //409 is a conflict http status code
        } else {
            try {
                //encrypt the password using bcrypt
                const hashedPwd = await bcrypt.hash(pwd, 10) //10 is a default salt rounds for password hashing
                //store the new user
                const newUser = { 
                    "username": user, 
                    "roles": { "User": 2001 },
                    "password": hashedPwd 
                }

                usersDB.setUsers([...usersDB.users, newUser])

                //write updated users to users.json file
                await fsPromises.writeFile(
                    path.join(__dirname, '..', 'model', 'users.json'),
                    JSON.stringify(usersDB.users)
                )

                console.log(usersDB.users)
                res.status(201).json({ 'success': `New user ${user} created!` }) //201 status code means new user was created
            } catch (err) {
                res.status(500).json({ 'message': err.message }) //500 status code is a server error
            }
        }
    }
}

module.exports = { handleNewUser }
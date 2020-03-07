const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const secretOrKey = require('../config/keys').secretOrKey
module.exports = {
    isEmpty: (val) => {
        return (val === undefined || val == null || val.length <= 0) ? true : false
    },

    // @edu aysnc function will always return a promise
    encrypt: async (data, saltRounds = 10) => {
        const salt = await bcrypt.genSalt(saltRounds)

        // encryption
        return bcrypt.hash(data, salt)
    },
    decrypt: async (data, encryption) => {

        // boolean
        return bcrypt.compare(data, encryption)
    },
    genToken: async (obj, expire, secretOrPrivateKey = secretOrKey) => {

        // token
        return jwt.sign(obj, secretOrPrivateKey, { expiresIn: expire })
    }
}
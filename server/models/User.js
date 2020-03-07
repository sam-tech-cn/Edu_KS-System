const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: {
        type: String, required: true
    },
    email: {
        type: String, required: true
    },
    password: {
        type: String, required: true
    },
    admin: {
        type: Boolean, default: false
    },
    note: {
        type: String
    }
}, {
    
    // @edu versionKey: false, mongodb will not save __v field, otherwise the default __v: 0 will stored
    versionKey: false
})

module.exports = mongoose.model('User', UserSchema)
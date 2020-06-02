const User = require('../models/User')
const utils = require('../utils/utils')

/**
 * Logs user into the system
 * @param {string} name 
 * @param {string} password 
 * @param {string} expire token expiration
 * @returns {Object} object with status code and message
 */
exports.loginUser = async (name, password, expire = '12h') => {
    const user = await User.findOne({ 'name': name })
    const result = {}
    if (!user) {
        result.status = 404
        result.msg = 'User not found'
        return result
    } else {

        // User existed, match password
        const isMatch = await utils.decrypt(password, user.password)
        if (!isMatch) {
            result.status = 400
            result.msg = 'Invalid password'
            return result
        } else {
            const loginInfo = {
                id: user.id,
                name: user.name,
                admin: user.admin,
                email: user.email
            }
            const token = await utils.genToken(loginInfo, expire)
            result.status = 200
            result.msg = {
                token: 'Bearer ' + token
            }
            return result
        }
    }
}

/**
 * Register user
 * @param {Object} user
 * @returns {Object} object with status code and message
 */
exports.registerUser = async (user) => {
    const returnUser = await User.find({ $or: [{ 'name': user.name }, { 'email': user.email }] })
    const result = {}
    if (!utils.isEmpty(returnUser)) {
        result.status = 400
        result.msg = 'User existed'
        return result
    } else {

        // password encryption
        user.password = await utils.encrypt(user.password)
        const newUser = new User(user)
        const savedUser = await newUser.save()
        result.status = 200
        result.msg = savedUser
        return result
    }
}

/**
 * Find all users order by user name ascending
 * @returns {Object[]} user list
 */
exports.getUserList = async () => {

    // @edu case insensitive
    return User.find().collation({ locale: 'en' }).sort({ name: 1 })
}

/**
 * Find user by id
 * @param {string} id 
 * @returns {Object} user
 */
exports.getUser = async (id) => {
    return User.findById(id)
}

/**
 * Update user by id
 * @param {string} id 
 * @param {Object} obj update object 
 * @returns {Object} updated user
 */
exports.updateUser = async (id, obj) => {
    if (obj.password) {
        obj.password = await utils.encrypt(obj.password)
    }

    return User.findOneAndUpdate({ _id: id }, obj, { new: true })
}

/**
 * Delete user
 * @param {string} id
 * @returns {Object} user before deleted
 */
exports.deleteUser = async (id) => {
    return User.findByIdAndDelete(id)
}

/**
 * Delete users in batch
 * @param {Object[]} ids user ids
 * @returns {null|Object} null or delete result
 */
exports.batchDeleteUser = async (ids) => {
    // the resolved object { n: 1, ok: 1, deletedCount: 1 }
    const users = await User.find({ _id: { $in: ids } })
    if (users.length <= 0 || users.length < ids.length) {
        return null
    } else {
        return User.deleteMany({ _id: { $in: ids } })
    }
}

/**
 * Update users as admin by ids
 * @param {Object[]} ids user ids
 * @returns {*} updated result
 */
exports.updateAllByIds = async (ids, updateFiled) => {
    return User.updateMany({ _id: { $in: ids } }, { $set: updateFiled })
}

/**
 * Get receivers except system operator
 * @param {Object} operator 
 * @returns {Object[]} array with each item which contains receiver property
 */
exports.getReceivers = async (operator) => {
    const users = await User.find()

    // extract receiver property only
    return users.filter(x => !utils.isEmpty(x) && x.id !== operator.id).map(x => {
        return { receiver: x.id }
    })
}
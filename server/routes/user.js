const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Utils = require('../utils/utils')
const passport = require('passport')

/**
 * Login
 * @route POST api/user/login
 */
router.post('/login', (req, res) => {
    const name = req.body.name
    const password = req.body.password
    User.findOne({ 'name': name }).then(user => {
        if (!user) {
            res.status(404).json('User not found')
        }

        // User existed, match password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                const loginInfo = {
                    id: user.id,
                    name: user.name,
                    admin: user.admin,
                    email: user.email
                }

                jwt.sign(loginInfo, 'secret', { expiresIn: '12h' }, (err, token) => {
                    if (err) throw err
                    res.status(200).json({
                        token: 'Bearer ' + token
                    })
                })
            } else {
                res.status(400).json('Invalid password')
            }
        })
    }).catch(err => {
        res.status(500).json(err)
    })
})

/**
 * Register user
 * @route POST api/user
 */
router.post('/', (req, res) => {
    User.find({
        $or: [
            { 'name': req.body.name },
            { 'email': req.body.email }
        ]
    }).then(user => {
        if (!Utils.isEmpty(user)) {
            res.status(400).json('User existed')
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                admin: req.body.admin,
                note: req.body.note
            })

            // password encryption
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, function (err, hash) {
                    if (err) throw err

                    // store hash in your password DB.
                    newUser.password = hash
                    newUser.save().then(user => {
                        res.status(200).json(user)
                    }).catch(err => {
                        res.status(500).json(err)
                    })
                })
            })
        }
    })
})

/**
 * Find all users
 * @route GET api/user
 */
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    
    // @edu '-' means exclude the field
    User.find().sort({ name: 1 }).select('-__v').then(users => {
        res.status(200).json(users)
    })
})

/**
 * Update user
 * @router PUT api/user/{userID}
 */
router.put('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, user) => {
        if (err) throw err
        if (!user) {
            res.status(404).json('User not found')
        } else {
            res.status(200).json(user)
        }
    })
})

/**
 * Delete user in bulk
 * @router DELETE api/deleteUsers
 */
router.delete('/deleteUsers', passport.authenticate('jwt', { session: false }), (req, res) => {
    User.deleteMany({ _id: { $in: req.body } }, (err, doc) => {
        if (err) throw err
        
        // { n: 1, ok: 1, deletedCount: 1 }
        if (doc['deletedCount'] == 0) {
            res.status(404).json('User not found')
        } else {
            if (doc['deletedCount'] == req.body.length) {
                res.status(200).json('successful operation')
            } else {
                res.status(404).json('Not fully deleted, some ids are not founded')
            }
        }
    })
})

/**
 * Delete user
 * @router DELETE api/user/{userID}
 * @edu Dynamic api should be on bottom, otherwise will get erro
 */
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    User.findByIdAndDelete(req.params.id, (err, user) => {
        if (err) throw err
        if (!user) {
            res.status(404).json('User not found')
        } else {
            res.status(200).json('successful operation')
        }
    })
})

module.exports = router
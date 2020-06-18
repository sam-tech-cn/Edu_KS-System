const express = require('express')
const router = express.Router()
const userService = require('../service/user-service')
const passport = require('passport')

/**
 * Login
 * @route POST api/user/login
 */
router.post('/login', async (req, res) => {
    try {
        const name = req.body.name
        const password = req.body.password
        const result = await userService.loginUser(name, password, '12h')
        res.status(result.status).json(result.msg)
    } catch (error) {
        res.status(500).json(error)
    }
})

/**
 * Register user
 * @route POST api/user
 */
router.post('/', async (req, res) => {
    try {
        const user = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            admin: req.body.admin,
            note: req.body.note
        }
        const result = await userService.registerUser(user)
        res.status(result.status).json(result.msg)
    } catch (error) {
        res.status(500).json(error)
    }
})

/**
 * Find all users
 * @route GET api/user
 */
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    userService.getUserList().then(doc => {
        res.status(200).json(doc)
    }).catch(err => {
        res.status(500).json(err)
    })
})

/**
 * Update users as admin by ids
 * @route PUT api/user/updateAllByIds
 */
router.put('/updateAllByIds', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const ids = req.body
        const updateFiled = {
            admin: req.query.admin,
        }
        const result = await userService.updateAllByIds(ids, updateFiled)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
})

/**
 * Get user by id
 * @router GET api/user/{userID}
 */
router.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    userService.getUser(req.params.id).then(doc => {
        if (!doc) {
            res.status(404).json('User not found')
        } else {
            res.status(200).json(doc)
        }
    }).catch(err => {
        res.status(500).json(err)
    })
})

/**
 * Update user
 * @router PUT api/user/{userID}
 */
router.put('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body)
        if (!user) {
            res.status(404).json('User not found')
        } else {
            res.status(200).json(user)
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

/**
 * Batch delete users
 * @router DELETE api/deleteUsers
 */
router.delete('/deleteUsers', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const result = await userService.batchDeleteUser(req.query.userIds)

        if (!result) {
            res.status(404).json('Users not found')
        } else {
            res.status(200).json('successful operation')
        }
    } catch (error) {
        res.json(500).json(error)
    }
})

/**
 * Delete user
 * @router DELETE api/user/{userID}
 * @edu Dynamic api should be on bottom, otherwise will get error
 */
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    userService.deleteUser(req.params.id).then(user => {
        if (!user) {
            res.status(404).json('User not found')
        } else {
            res.status(200).json('successful operation')
        }
    }).catch(err => {
        res.status(500).json(err)
    })
})

module.exports = router
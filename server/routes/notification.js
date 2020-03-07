const express = require('express')
const router = express.Router()
const passport = require('passport')
const notificationService = require('../service/notification-service')

/**
 * Get notification by receiver
 * @route GET api/notification
 */
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {

        // only the system operator get notification
        const notification = await notificationService.getNotification(req.user.id)
        res.status(200).json(notification)
    } catch (error) {
        res.status(500).json(error)
    } 
})

/**
 * Update notification by read_status or delete_status
 * @route PUT api/notification
 */
router.put('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {       
        
        // actually one of below params must be specified
        const updateFiled = {}
        updateFiled.read_status = req.query.read_status
        updateFiled.delete_status = req.query.delete_status
        const log_id = req.query.log_id
        const receiverObjectId = req.query.receiver_id

        if ((updateFiled.read_status == undefined && updateFiled.delete_status == undefined)
            || (!log_id && !receiverObjectId)) {
            return res.status(400).json('Invalid input')
        }

        const result = await notificationService.updateNotification(log_id, receiverObjectId, updateFiled)

        if (!result) {
            res.status(404).json(result)
        } else {
            res.status(200).json(result)
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

/**
 * Update all read_status or delete_status to true
 * @route PUT api/notification/updateAll
 */
router.put('/updateAll', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const receiver_id = req.user.id
        const updateFiled = {
            read_status: req.query.read_status,
            delete_status: req.query.delete_status
        }

        const result = await notificationService.updateAll(receiver_id, updateFiled)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
})


module.exports = router
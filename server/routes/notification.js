const express = require('express')
const router = express.Router()
const Log = require('../models/Log')
const Utils = require('../utils/utils')
const passport = require('passport')

/**
 * Get notification by receiver
 * @route GET api/notification
 */
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const receiver_id = req.user.id

        // @edu multipe populate pattern [{path:'',select:'<fild1>,<fild2>'},{}]
        const log = await Log.find({
            receivers: {
                $elemMatch: {
                    receiver: receiver_id, delete_status: false
                }
            }
        }).populate([
            { path: 'project_id', select: '_id, project_code' },
            { path: 'operator', select: '_id, name' }
        ]).sort('-action_time')

        let notification = []
        if (log.length > 0) {
            notification = log.map(x => {
                const receivers = x.receivers.filter(x =>
                    x.receiver == receiver_id
                )

                if (Utils.isEmpty(receivers) || Utils.isEmpty(x.project_id)) return null

                let rst = {}
                if (Utils.isEmpty(x.operator)) {
                    rst.operator_id = null
                    rst.operator = null
                } else {
                    rst.operator_id = x.operator._id
                    rst.operator = x.operator.name
                }
                rst.log_id = x.id
                rst.receiver_id = receiver_id

                // @edu if object is undefined, undefined's property will throw an error
                rst.project_id = x.project_id._id
                rst.project_code = x.project_id.project_code
                rst.action_type = x.action_type
                rst.action_time = x.action_time
                rst.read_status = receivers[0].read_status
                rst.delete_status = receivers[0].delete_status
                return rst
            }).filter(x => !Utils.isEmpty(x))
        }
        res.status(200).json(notification)
    } catch (error) {
        res.status(500).json(error)
    }
})

/**
 * Update notification by read_status or delete_status
 * @route PUT api/notification
 */
router.put('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    
    // actually one of below params must be specified
    const read_status = req.query.read_status
    const delete_status = req.query.delete_status
    const log_id = req.query.log_id
    const receiver_id = req.user.id
    if ((!read_status && !delete_status) || (!log_id && !receiver_id)) {
        res.status(401).json('Invalid input')
        return
    }

    let updateContents = {}
    if (read_status) {
        updateContents = {
            'receivers.$.read_status': read_status
        }
    } else {
        updateContents = {
            'receivers.$.delete_status': delete_status
        }
    }

    Log.findOneAndUpdate({ '_id': log_id, 'receivers._id': receiver_id },
        { $set: updateContents },
        { new: false })
        .then(doc => {
            if (Utils.isEmpty(doc)) {
                res.status(404).json('Log not found')
            } else {
                res.status(200).json('successful operation')
            }
        }).catch(err => {
            res.status(500).json(err)
        })
})

/**
 * Update all read_status
 * @route PUT api/notification/readAll
 */
router.put('/readAll', passport.authenticate('jwt', { session: false }), (req, res) => {
    const receiver_id = req.user.id
    const match = {
        receiver: receiver_id,
        read_status: false
    }
    const updateContents = {
        'receivers.$.read_status': true
    }
    updateAll(match, updateContents).then(doc => {
        res.status(200).json(doc)
    }).catch(err => {
        res.status(500).json(err)
    })
})

/**
 * Deleate all
 * @route PUT api/notification/deleteAll
 */
router.put('/deleteAll', passport.authenticate('jwt', { session: false }),(req, res) => {
    const receiver_id = req.user.id
    const match = {
        receiver: receiver_id,
        delete_status: false
    }
    const updateContents = {
        'receivers.$.delete_status': true
    }
    updateAll(match, updateContents).then(doc => {
        res.status(200).json(doc)
    }).catch(err => {
        res.status(500).json(err)
    })
})

/**
 * Update log by specified conditions and update contents
 * @param {*} match the conditions
 * @param {*} updateContents the contents which need to be updated
 */
function updateAll(match, updateContents) {
    return new Promise((resolve, reject) => {
        Log.updateMany({
            receivers: {
                $elemMatch: match
            }
        },
            {
                $set: updateContents
            }
        ).then(doc => {
            resolve(doc)
        }).catch(err => {
            reject(err)
        })
    })
}

module.exports = router
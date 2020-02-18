const express = require('express')
const router = express.Router()
const Log = require('../models/Log')
const passport = require('passport')

/**
 * Get project modification log by project_id
 * @route api/log/findByProject
 */
router.get('/findByProject', passport.authenticate('jwt', { session: false }), (req, res) => {
    const project_id = req.query.project_id
    const sortType = req.query.sortByTime ? req.query.sortByTime : -1
    Log.find({ project_id: project_id })
        .sort({ action_time: sortType })
        .then(doc => {
            res.status(200).json(doc)
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

module.exports = router
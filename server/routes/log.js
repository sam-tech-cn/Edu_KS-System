const express = require('express')
const router = express.Router()
const logService=  require('../service/log-service')
const passport = require('passport')

/**
 * Get project modification log by project_id order by action_time default descending
 * @route GET api/log/findByProject
 */
router.get('/findByProject', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const id = req.query.project_id
        const sortType = req.query.sortByTime ? req.query.sortByTime : -1
        res.status(200).json(await logService.getLogList(id,sortType))
    } catch (error) {
        res.status(500).json(error)
    }
})

/**
 * Get project modification log by project_id order by action_time default descending
 * @route POST api/log/findByIds
 */
router.post('/findByIds', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const ids = req.body
        const sortType = req.query.sortByTime ? req.query.sortByTime : -1
        res.status(200).json(await logService.getLogByIds(ids,sortType))
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router
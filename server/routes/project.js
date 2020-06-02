const express = require('express')
const router = express.Router()
const utils = require('../utils/utils')
const passport = require('passport')
const projectService = require('../service/project-service')
const logService = require('../service/log-service')

/**
 * Add a new project also update log
 * @route POST api/project
 * @edu asyn The keyword await makes JavaScript wait until that promise settles and returns its result. 
 */
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {

    // get user info from passport strategy
    const operator = req.user
    const project = req.body
    const log = await projectService.addProject(operator, project)
    const savedLog = await logService.saveLog(log)
    res.status(200).json(savedLog)
  } catch (error) {
    res.status(500).json(error)
  }
})

/**
 * Find all projects
 * @route GET api/project
 */
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  projectService.getProjectList().then(projects => {
    res.status(200).json(projects)
  }).catch(err => {
    res.status(500).json(err)
  })
})

/**
 * Update project
 * @route PUT api/project/{projectID}
 */
router.put('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const id = req.params.id
    const operator = req.user
    const updatePrj = req.body

    const log = await projectService.updateProject(id, operator, updatePrj)

    if (utils.isEmpty(log)) {
      return res.status(400).json('Project not found')
    }

    if (!utils.isEmpty(log.record)) {
      const savedLog = await logService.saveLog(log)
      res.status(200).json(savedLog)
    } else {
      res.status(200).json('successful operation but no need to update project')
    }
  } catch (error) {
    res.status(500).json(error)
  }
})

/**
 * Batch delete projects
 * @router DELETE api/deleteProjects
 */
router.delete('/deleteProjects', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const operator = req.user
  const logs = await projectService.batchDeleteProject(req.query.projectIds, operator)

  if (!logs) {
    res.status(404).json('Projects not found')
  } else {
    const result = await logService.saveManyLogs(logs)
    res.status(200).json(result)
  }

})

/**
 * Get project by id
 * @router GET api/project/{projectID}
 */
router.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  projectService.getProject(req.params.id).then(doc => {
      if (!doc) {
          res.status(404).json('Project not found')
      } else {
          res.status(200).json(doc)
      }
  }).catch(err => {
      res.status(500).json(err)
  })
})

/**
 * Delete project
 * @router DELETE api/project/{projectID}
 */
router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const projectID = req.params.id
    const operator = req.user
    const log = await projectService.deleteProject(projectID, operator)

    if (!log) {
      res.status(404).json('Project not found')
    } else {

      // save log
      const savedLog = await logService.saveLog(log)
      res.status(200).json(savedLog)
    }
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router
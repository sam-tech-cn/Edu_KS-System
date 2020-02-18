const express = require('express')
const router = express.Router()
const Project = require('../models/Project')
const Log = require('../models/Log')
const Utils = require('../utils/utils')
const passport = require('passport')
const User = require('../models/User')

const action_type = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE"
}

const project_item = {
  'assignee': 'Assignee',
  'project_code': 'Project Code',
  'design_start': 'Design Start Time',
  'design_end': 'Degign End Time',
  'design_perc': 'Design Complete',
  'design_approval': 'Design Approval',
  'coding_start': 'Coding Start Time',
  'coding_end': 'Coding End Time',
  'coding_perc': 'Coding Complete',
  'coding_approval': 'Coding Approval',
  'testing_start': 'Test Start Time',
  'testing_end': 'Test End Time',
  'testing_perc': 'Test Complete',
  'testing_approval': 'Test Approval',
  'release': 'Release'
}

/**
 * Add a new project also update log
 * @route POST api/project
 * @edu asyn The keyword await makes JavaScript wait until that promise settles and returns its result. 
 */
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const newProject = new Project(req.body)
    
    // @edu await works only inside async functions
    let project = await newProject.save()

    // get user info from passport strategy
    const operator = req.user
    let receivers = await getReceivers(operator)

    const newLog = new Log({
      operator: operator.id,
      project_id: project.id,
      action_type: action_type.CREATE,
      record: "",
      receivers: receivers,
    })

    newLog.save((err, doc) => {
      if (err) throw err
      res.status(200).json(doc)
    })
  } catch (error) {
    res.status(500).json(error)
  }
})

/**
 * Find all projects
 * @route GET api/project
 */
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Project.find()
    .sort({ project_code: 1 })
    .select('-__v')
    .populate('assignee', '-__v')
    .then(projects => {
      res.status(200).json(projects)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

/**
 * Update project
 * @route PUT api/project/{projectID}
 */
router.put('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const operator = req.user
    const newPrj = req.body

    // @edu be aware of mongoose return doc , if need to compare doc property with others , must JSON.stringify
    let oldPrj = await Project.findOneAndUpdate({ _id: req.params.id }, req.body, { new: false })
    oldPrj = JSON.parse(JSON.stringify(oldPrj))

    // @edu if can't find object by id, it will return null
    if (Utils.isEmpty(oldPrj)) {
      res.status(400).json('Project not found')
      return
    }

    const receivers = await getReceivers(operator)
    const record = makeRecord(oldPrj, newPrj)
    if (!Utils.isEmpty(record)) {
      const newLog = new Log({
        operator: operator.id,

        // @edu because stringify, be aware of '_id'
        project_id: oldPrj['_id'],
        action_type: action_type.UPDATE,
        record: record,
        receivers: receivers,
      })
      await newLog.save()
      res.status(200).json('successful operation and log updated')
    } else {
      res.status(200).json('successful operation and no need to update project')
    }
  } catch (error) {
    res.status(500).json(error)
  }
})

/**
 * Delete project in bulk
 * @router DELETE api/deleteProjects
 */
router.delete('/deleteProjects', passport.authenticate('jwt', { session: false }), (req, res) => {
  Project.deleteMany({ _id: { $in: req.body } }, (err, doc) => {
    if (err) throw err

    // { n: 1, ok: 1, deletedCount: 1 }
    if (doc['deletedCount'] == 0) {
      res.status(404).json('Project not found')
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
 * Delete project
 * @router DELETE api/project/{projectID}
 */
router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const oldPrj = await Project.findByIdAndDelete(req.params.id)

    if (!oldPrj) {
      res.status(404).json('Project not found')
    } else {

      // save log
      const project_code = oldPrj.project_code
      const operator = req.user
      const receivers = await getReceivers(operator)
      const newLog = new Log({
        operator: operator.id,
        project_id: req.params.id,
        action_type: action_type.DELETE,
        record: `Project Code|${project_code}|null`,
        receivers: receivers,
      })
      await newLog.save().then(doc => {
        res.status(200).json(doc)
      })
    }
  } catch (error) {
    res.status(500).json(error)
  }
})

/**
 * Make record with specified pattern (<project item name>|<old value>|<new value>) sepearte by ','
 * @param {*} oldPrj 
 * @param {*} newPrj 
 */
function makeRecord(oldPrj, newPrj) {
  let recordArr = []
  Object.keys(oldPrj).forEach(key => {
    if (newPrj[key] !== undefined && oldPrj[key] !== newPrj[key]) {
      recordArr.push(project_item[key] + '|' + oldPrj[key] + '|' + newPrj[key])
    }
  })
  if (recordArr.length > 0) {
    return recordArr.join(',')
  } else {
    return ""
  }
}

/**
 * Get receivers except system operator
 * @param {*} operator 
 */
function getReceivers(operator) {
  return new Promise((resolve, reject) => {
    User.find().then(users => {
      resolve(users.filter(x => !Utils.isEmpty(x) && x.id !== operator.id).map(x => {
        return { receiver: x.id }
      }))
    }).catch(err => {
      reject(err)
    })
  })
}

module.exports = router
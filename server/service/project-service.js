const Project = require('../models/Project')
const logService = require('./log-service')
const userService = require('./user-service')

const action_type = {
    CREATE: "CREATE",
    UPDATE: "UPDATE",
    DELETE: "DELETE"
}

/**
 * Add a new project
 * @param {Object} operator system operator
 * @param {Object} project project to save
 * @returns {Object} log
 */
exports.addProject = async (operator, project) => {
    const savedPrj = await new Project(project).save()
    const receivers = await userService.getReceivers(operator)
    const log = {
        operator: operator.id,
        operator_name: operator.name,
        project_id: savedPrj.id,
        project_code: savedPrj.project_code,
        action_type: action_type.CREATE,
        record: '',
        receivers: receivers,
    }
    return log
}

/**
 * Find all projects order by project_code ascending
 * @returns {Object[]} project list
 */
exports.getProjectList = async () => {
    return Project.find()
        .collation({ locale: 'en' })
        .sort({ project_code: 1 })
        .populate('assignee')
}

/**
 * Update project by id
 * @param {string} id project id
 * @param {Object} operator system operator
 * @param {Object} obj get from operator input
 * @returns {null|Object} null or log
 */
exports.updateProject = async (id, operator, obj) => {
    const oldPrj = await Project.findOneAndUpdate({ _id: id }, obj, { new: false })
    if (!oldPrj) {
        return null
    } else {
        const receivers = await userService.getReceivers(operator)

        const record = logService.makeRecord(oldPrj, obj)

        // return log
        const log = {
            operator: operator.id,
            operator_name: operator.name,
            project_id: id,
            project_code: oldPrj.project_code,
            action_type: action_type.UPDATE,
            record: record,
            receivers: receivers,
        }
        return log
    }
}

/**
 * Delete project by id
 * @param {string} id project id
 * @param {Object} operator system operator
 * @returns {null|Object} null or log
 */
exports.deleteProject = async (id, operator) => {
    const oldPrj = await Project.findByIdAndDelete(id)
    if (!oldPrj) {
        return null
    } else {
        const receivers = await userService.getReceivers(operator)
        const project_code = oldPrj.project_code
        const log = {
            operator: operator.id,
            operator_name: operator.name,
            project_id: id,
            project_code: oldPrj.project_code,
            action_type: action_type.DELETE,
            record: `Project Code|${project_code}|null`,
            receivers: receivers,
        }
        return log
    }
}

/**
 * Batch delete projects
 * @param {Object[]} ids  project ids
 * @param {Object} operator system operator
 * @returns {null|Object} null or array of logs
 */
exports.batchDeleteProject = async (ids, operator) => {
    const projects = await Project.find({ _id: { $in: ids } })

    if (projects.length <= 0 || projects.length < ids.length) {
        return null
    } else {
        await Project.deleteMany({ _id: { $in: ids } })
    }

    const receivers = await userService.getReceivers(operator)
    const logs = projects.map(x => {
        return {
            operator: operator.id,
            operator_name: operator.name,
            project_id: x.id,
            project_code: x.project_code,
            action_type: action_type.DELETE,
            record: `Project Code|${x.project_code}|null`,
            receivers: receivers
        }
    })
    return logs
}

/**
 * Find project by id
 * @param {string} id 
 * @returns {Object} project
 */
exports.getProject = async (id) => {
    return Project.findById(id)
}

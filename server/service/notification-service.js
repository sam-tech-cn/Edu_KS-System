const Log = require('../models/Log')
const User = require('../models/User')
const Project = require('../models/Project')

/**
 * Get notification by receiver with false delete status, order by action time descending
 * @param {string} id receiver id
 * @returns {Object[]} empty array of notification
 */
exports.getNotification = async (id) => {

    // @edu $eleMatch the receiver array contains other items not only receiver
    const logs = await Log.find({
        receivers: {
            $elemMatch: {
                receiver: id, delete_status: false
            }
        }
    }).sort({ action_time: -1 })
        .populate('operator', '_id name email admin')
        .populate('project_id', '_id project_code')

    let notification = []
    if (logs.length > 0) {
        notification = await Promise.all(logs.map(async (x) => {
            let result = {}

            // only extract receiver
            const receivers = x.receivers.filter(x =>
                x.receiver == id
            )

            // edage case
            const operator = await User.findById(x.operator)
            const project = await Project.findById(x.project_id)

            // check operator/project existence
            if (!operator) {
                result.operator_name = x.operator_name
            } else {
                result.operator_name = operator.name
            }

            if (!project) {
                result.project_code = x.project_code
            } else {
                result.project_code = project.project_code
            }

            // combine object pattern follow api doc
            result = Object.assign(result,
                {
                    log_id: x.id,

                    // the receiver object unique id
                    receiver_id: receivers[0].id,
                    operator_id: x.operator,
                    project_id: x.project_id,
                    action_type: x.action_type,
                    action_time: x.action_time,
                    read_status: receivers[0].read_status,
                    delete_status: receivers[0].delete_status
                }
            )
            return result
        }))
    }

    return notification
}

/**
 * Update all false read_status or delete_status to true
 * @param {string} id the receiver
 * @param {Object} updateFiled update read_status or delete_status
 * @returns {*} updated result
 */
exports.updateAll = async (id, updateFiled) => {
    const match = {}
    match.receiver = id

    let updateContents = {}
    if (updateFiled.read_status != undefined) {
        match.read_status = false
        updateContents = {
            'receivers.$.read_status': true
        }
    } else {
        match.delete_status = false
        updateContents = {
            'receivers.$.delete_status': true
        }
    }

    // update log
    const result = await Log.updateMany({ receivers: { $elemMatch: match } }, { $set: updateContents })

    return result
}

/**
 * Update all read_status or delete_status by receiver objectId array
 * @param {Object[]} ids the receiver objectId array
 * @param {Object} updateFiled update read_status or delete_status
 * @returns {*} updated result
 */
exports.updateAllByIds = async (ids, updateFiled) => {
    const match = {}
    match._id = { $in: ids }

    let updateContents = {}
    if (updateFiled.read_status != undefined) {
        updateContents = {
            'receivers.$.read_status': updateFiled.read_status
        }
    } else {
        updateContents = {
            'receivers.$.delete_status': updateFiled.delete_status
        }
    }

    // update log
    const result = await Log.updateMany({ receivers: { $elemMatch: match } }, { $set: updateContents })

    return result
}

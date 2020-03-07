const Log = require('../models/Log')
const User = require('../models/User')
const Project = require('../models/Project')

/**
 * Get notification by receiver with false delete status, order by action time descending
 * @param {*} id receiver id
 * @returns {*} empty array of notification
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
 * Update notification by read_status or delete_status
 * @param {*} log_id 
 * @param {*} receiverObjId the receiver object unique id
 * @param {*} updateFiled update read_status or delete_status
 * @returns {*} null or updated log
 */
exports.updateNotification = async (log_id, receiverObjId, updateFiled) => {
    let updateContents = {}

    // @edu check key in object
    if (updateFiled.read_status != undefined) {
        updateContents = {
            'receivers.$.read_status': updateFiled.read_status
        }
    } else {
        updateContents = {
            'receivers.$.delete_status': updateFiled.delete_status
        }
    }

    const result = await Log.findOneAndUpdate(
        { '_id': log_id, 'receivers._id': receiverObjId },
        { $set: updateContents },
        { new: true })

    if (!result) {
        return null
    } else {
        return result
    }
}

/**
 * Update all false read_status or delete_status to true
 * @param {*} id the receiver
 * @param {*} updateFiled update read_status or delete_status
 * @returns {*} updated log
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
